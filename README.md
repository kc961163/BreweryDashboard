# Web Development Project 5 - DashboardBrewery

Submitted by: Krishna Choudhary

This web app: A comprehensive brewery dashboard that allows users to search, filter, and explore brewery data from across the United States using the Open Brewery DB API.

Time spent: 9 hours spent in total

## Required Features

The following **required** functionality is completed:

- [X] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [X] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  -  *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [X] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset


The following **optional** features are implemented:

- [X] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - e.g., an additional description, graph annotation, suggestion for which filters to use, or an additional page that explains more about the data
- [X] The site allows users to toggle between different data visualizations
  - User should be able to use some mechanism to toggle between displaying and hiding visualizations 

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='project_5.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

## Notes

### Challenges Encountered

1. **API Integration and Data Handling**  
  - Working with the Open Brewery DB API required implementing rate limit management and handling inconsistent data formats. Defensive programming techniques were employed to ensure reliable data display throughout the application.

2. **State Management Across Components**  
  - Maintaining synchronized state between the global data store and local component states was challenging. This was particularly evident when preserving user interactions, such as filters and visualization preferences, during navigation between the dashboard and detail views.

3. **Responsive Data Visualization Implementation**  
  - Transforming raw brewery data into formats suitable for interactive charts required careful optimization. Ensuring that visualizations remained both informative and visually appealing across different screen sizes demanded sophisticated configuration of the Recharts library.

## License

    Copyright [yyyy] [name of copyright owner]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.