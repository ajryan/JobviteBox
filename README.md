# JobviteBox

JobviteBox is a [jQuery](http://jquery.com) plugin that fetches a feed of job listings from [Jobvite](http://jobvite.com) and displays it on your page.

See a [demo](http://ajryan.github.com/JobviteBox/demo.html)

## Functions

### $('selector').jobviteBox(options)

Populates the element targeted by the selector with the
contents of the job feed for the given companyId.

The optional predicate function 'filter' is executed against each job
to determine whether it should be displayed.

The optional function 'after' is executed after the target element is populated.

```
options {
        companyId: Jobvite company Id. To find your company ID, login to
                   Jobvite and then click the View All Jobs link at the
                   bottom of the Open Jobs list. View source on the All
                   Jobs page and look for the **companyId** JavaScript
                   variable.

        filter:    predicate function(job, i) to execute against each job
                   to determine whether it should be displayed. i is the
                   offset of the job in the list. see below for job 
                   JSON format.

        after:     function(jobsFound) to execute after element is
                   populated. jobsFound is true if the query and
                   filter resulted in displaying any jobs, otherwise
                   false.
}
```

The feed HTML is structured as follows:

```html
<div class="jobvite-job">
	<span class="jobvite-title"><a href="url" class="jobvite-jobdetaillink">Title</a></span>
	<span class="jobvite-joblocation">Location</span>
	<span class="jobvite-jobdescription">Description</span>
	<span class="jobvite-jobapply"><a href="url" class="jobvite-jobapplylink">Apply</a></span>
</div>
```

### window.JobviteBox.getJobviteData(companyId, jobCallback, errorCallback)

Fetches jobVite jobs as JSON.

```
companyId:     Jobvite company ID (see above).

jobCallback:   function(json) called when Jobvite data is
               successfully retrieved.

errorCallback: function(textStatus) called when an Ajax error
               or timeout occurs while retrieving Jobvite data.
```

The argument to jobCallback is an array of jobs objects with the following signature:

```json
{
	apply-url: "http://url",
	briefdescription: "string",
	category: "string",
	date: "8/9/2012",
	description: "<p>html string</p>",
	detail-url: "http://url",
	id: "jobid",
	jobtype: "Full-Time",
	location: "string",
	region: "string",
	requisitionid: "11111",
	title: "string"
}
```

## To-Do

Direct XML parsing rather than relying on YQL - too easy to get throttled,
and performance is not great.