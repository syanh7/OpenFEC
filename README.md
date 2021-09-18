# FEC Campaign Contributions Data Visualization

Visualize Federal Campaign Contributions using D3 and data from the FEC

## Description

This code is for a full stack web application from seeding a database to displaying data visually on a web browser

a live version of this code is here at www.sierrahughey.com

## Tech Stack

__Front End:__ HTML5, CSS, JavaScript, AJAX, Bootstrap, D3.js
__Back End:__ Python, Flask, PostgreSQL, SQLAlchemy
__API's__: OpenFEC

## Features

Navigate to federal election candidate through office they're running for.

![navigate to candidate](/img/navigate-to-canidate.gif)

From there a visualization pops up of a candidates committee contributions. A JS tooltip is implemented to interact with the visualization over hover. 

![visualization popup](/img/vis-popup.gif)

An option to toggle between visualization view and table view is implemented. 

![toggle view](/img/toggle-view.gif)

The table view is fully sortable by column, and committees are clickable, allowing for navigation to the committee page and vice versa

![sort](/img/sort.gif)
