# JobViteBox

JobViteBox is a jQuery plugin fetches a feed of job listings and displays it on your page.

## Functions

### $.getJobViteData(companyId)

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

To find your company ID, login to JobVite and then click the
View All Jobs link at the bottom of the Open Jobs list. View
source on the All Jobs page and look for the **companyId**
JavaScript variable.

### $('selector').jobViteBox(companyId)

Populates the element targeted by the selector with the
contents of the job feed. The feed is structured as follows:

```html
<div class="jobvite-job">
	<span class="jobvite-title">Title</span>
	<span class="jobvite-joblocation">Location</span>
	<span class="jobvite-jobdescription">Description</span>
	<span class="jobvite-jobapply"><a href="url" class="">Apply</a></span>
</div>
```