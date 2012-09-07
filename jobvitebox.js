/*!
 * JobviteBox plugin
 * http://ajryan.github.com/JobviteBox/
 *
 * Copyright 2012 Aidan Ryan
 * Released under the MIT license
 * https://github.com/ajryan/JobviteBox/blob/master/LICENSE
*/
//
// window.JobviteBox
//    provides utility function for loading JSON Jobvite data for a company
//
(function(window, undefined) {
    "use strict"

    var JB = {
        //
        // window.JobviteBox.getJobviteData
        //    fetches Jobvite jobs as JSON
        //
        //    companyId:     Jobvite company ID (see README.md for how to locate).
        //
        //    jobCallback:   function(json) called when Jobvite data is
        //                   successfully retrieved.
        //
        //    errorCallback: function(textStatus) called when an Ajax error
        //                   or timeout occurs while retrieving Jobvite data.
        //
        // TODO: skip YQL and parse XML directly, to work around throttling
        //       and improve performance
        //
        getJobviteData: function(companyId, jobCallback, errorCallback) {
            var
                query = JB._yqlQueryFormat.replace('{{companyId}}', companyId),
                ajaxOptions = $.extend(true, {
                    data: {
                        q: query,
                    },
                    success: function(json) {
                        if (!json.query || json.query.count < 1 || !json.query.results || !json.query.results.job) {
                            if (errorCallback) {
                                errorCallback("No jobs found for company Id " + companyId)
                            }
                        }
                        else {
                            jobCallback(json.query.results.job);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if (errorCallback) {
                            errorCallback(textStatus);
                        }
                    },
                }, JB._baseAjaxOptions);

            $.ajax(ajaxOptions);
        },
        _yqlQueryFormat: "select * from xml where url='http://www.jobvite.com/CompanyJobs/Xml.aspx?c={{companyId}}' and itemPath='result.job'",
        _baseAjaxOptions: {
            url: "http://query.yahooapis.com/v1/public/yql",
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'yqlCallback',
            async: true,
            cache: true,
            global: true,
            data: {
                format: 'json',
                env: 'store://datatables.org/alltableswithkeys',
                callback: 'yqlCallback'
            },
            timeout: 10000
        },
        _isFunction: function(func) {
            return func && typeof(func) === "function"
        },
        _executeIfFunction: function(func) {
            if (JB._isFunction(func)) {
                func();
            }
        }
    };

    window.JobviteBox = JB;

    // AMD module
    if (typeof define === "function" && define.amd && define.amd.JobviteBox) {
        define("jobvitebox", [], function() { return JB; });
    }

})(window);

(function($) {
    "use strict";

    //
    // $('selector').jobviteBox(options)
    //     jQuery plugin to display Jobvite data
    //
    //     options {
    //         companyId: Jobvite company Id.
    //
    //         after:     function(jobsFound) to execute after element is
    //                    populated. jobsFound is true if the query and
    //                    filter resulted in displaying any jobs, otherwise
    //                    false.
    //
    //         filter:    predicate function(job, i) to execute against each job
    //                    to determine whether it should be displayed. i is the
    //                    offset of the job in the list. see README.md for job 
    //                    JSON format.
    //    }
    //
    $.fn.jobviteBox = function(options) {
        // don't act on non-existent elements
        if (!this.length) return this;

        var settings = $.extend({
            companyId: '',
            filter: null,
            after: null
        }, options);

        return this.each(function() {
            
            var $this = $(this),
                jobsData = $this.data('jobvite-jobs'),
                useFilter = JobviteBox._isFunction(settings.filter),

                storeJobs = function(jobs) {
                    jobsData = {
                        companyId: settings.companyId,
                        jobs: jobs
                    };
                    $this.data('jobvite-jobs', jobsData);
                },

                processJobs = function(jobs) {
                    var html = [];
                    var i = 0;
                    $.each(jobs, function(i, job) {
                        if (!useFilter || settings.filter(job, i)) {
                            // if no brief description provided, fall back on excerpt of full description
                            var description = job.briefdescription || (job.description.substring(0, 200) + "...");

                            html.push(
                                '<div class="jobvite-job">' +
                                    '<span class="jobvite-jobtitle"><a href="' + job['detail-url'] + '" class="jobvite-jobdetaillink">' +  job.title + '</a></span>' +
                                    '<span class="jobvite-joblocation">' + job.location + '</span>' +
                                    '<span class="jobvite-jobdescription">' + description + '</span>' +
                                    '<span class="jobvite-jobapply"><a href="' + job['apply-url'] + '" class="jobvite-jobapplylink">Apply</a></span>' +
                                '</div>');
                        }
                        i++;
                    });
                    
                    var jobsFound = html.length > 0;
                    if (jobsFound) {
                        $this.html(html.join(''));
                    }
                    JobviteBox._executeIfFunction(settings.after(jobsFound));
                },

                jobviteError = function(errorMessage) {
                    $this.html('<div class="jobvite-error">' + errorMessage + '</div>');
                    JobviteBox._executeIfFunction(settings.after);
                };

            // if we have jobs data in cache for the current
            // company id, just process it through the filter
            if (jobsData && jobsData.companyId === settings.companyId) {
                processJobs(jobsData.jobs);
            }
            // with no cached data for the current company id, fetch
            // the feed, cache it, and then process
            else {
                JobviteBox.getJobviteData(
                    settings.companyId,
                    function(jobs) {
                        storeJobs(jobs);
                        processJobs(jobs);
                    },
                    jobviteError
                );
            }
        });
    };

})(jQuery);