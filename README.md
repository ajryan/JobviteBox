# JobviteBox

JobviteBox is a jQuery plugin fetches a feed of job listings and displays it on your page.

## Functions

### $.getJobviteData(companyId)

Returns an array of jobs objects with the following signature:

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

To find your company ID, login to Jobvite and then click the
View All Jobs link at the bottom of the Open Jobs list. View
source on the All Jobs page and look for the **companyId**
JavaScript variable.

### $('selector').jobviteBox(companyId, after)

Populates the element targeted by the selector with the
contents of the job feed for the given companyId. The optional
function 'after' is executed after the target element is populated.

The feed is structured as follows:

```html
<div class="jobvite-job">
	<span class="jobvite-title"><a href="url" class="jobvite-jobdetaillink">Title</a></span>
	<span class="jobvite-joblocation">Location</span>
	<span class="jobvite-jobdescription">Description</span>
	<span class="jobvite-jobapply"><a href="url" class="jobvite-jobapplylink">Apply</a></span>
</div>
```

## To-Do

Accept a function on `jobviteBox` that allows filtering of the jobs.