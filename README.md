# FEC Campaign Contributions Data Visualization

Visualize Federal Campaign Contributions using D3 and data from the FEC

## Description

This code is for a full stack web application from seeding a database to displaying data visually on a web browser. 

The purpose of this project is to allow users to easily find candidates of federal elections and look through their campaign contributions to see where their money is coming from.

The data comes from the FEC website, through their <a href="https://api.open.fec.gov/developers/" target="_blank" rel="noopener">API <a/>and from their <a href="https://www.fec.gov/data/browse-data/?tab=bulk-data" target="_blank" rel="noopener">bulk download files </a>that are available on their site.


A live version of this code is here at www.sierrahughey.com

## Tech Stack

__Front End:__ HTML5, CSS, JavaScript, AJAX, Bootstrap, D3.js<br>
__Back End:__ Python, Flask, PostgreSQL, SQLAlchemy<br>
__API's__: OpenFEC<br>

## Features

Navigate to federal election candidate through office they're running for. From there, a visualization pops up of a candidates' committee contributions. A JS tooltip is implemented to interact with the visualization over hover. 

An option to toggle between visualization view and table view is implemented. The table view is fully sortable by column, and committees are clickable, allowing for navigation to the committee page and vice versa.<br>
<img width="33%" src="/img/navigate-to-candidate.gif">  <img width="33%" src="/img/toggle-view.gif">
