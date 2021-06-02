# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Dayer Simon | 271991 |
| AJEGHRIR Mustapha | 333806 |
| Sorin Mircea | 306618 |

The name of this project is : "Being active is Fun & Healthy"

### Dataset

As all the team is keen on sports and tracking as much data related to it as possible, we decided to direct our project towards those fields of studies. Moreover, one of the team members has been very dedicated to recording his physical activity and health related data during the past year. So based on those unique data points, we created a data-set with entries from around 150 runs and 90 bike rides collected with a "Samsung watch 3", we also have 3 months of sleep,walk  ,calories and heart rate data. 

Those raw dataset were all nights information are recorded can be find folowing this path "/Project/Data/Sleep/Sleep-export.csv" and the same way the raw dataset of information concerning the activities can be find following this path "/Project/Data/strava/activities.csv".

Moreover, all the gpx files of each activities recorded with the Samsung watch can be find with this path "/Project/Data/strava/activities/..."

### Problematic

The goal of the project is to provide a dashboard that aggregates multiple data sources (Samsung Health Data, Strava and AutoSleep) and gives a bird's eye view of the progress over an extended period of time.

A second goal is to use the different data points towards arriving to some correlations (like a possible link between quality of sleep and sport activities).

With this visualization, we want to mainly target the sports audience which records their data and would want a nice way to analyze them. Moreover, by going more deeply into the relationship between sleep and sports we can pretend to target a much wider audience.

### Exploratory Data Analysis and creating the website
In order to be able to start visualise our data in the Javascipt library D3 we had to first preprocess our data with Python. This is why we provide a few jupyter notebooks. Their purpose are explain below:

* strava_gpx_parser.ipynb : script that parsed the gpx files and converts them into a csv/json map

* preprocessing.ipynb : In this files we preprocess the data to create for each graph in the following list, a csv containing only the useful feature that we want to visualise.(The activity /no activity vs sleep analysis, Calories vs Sleep analysis , Moving Time vs Sleep analysis ,The stackedbar plot for Motivation analysis, The radar plot for Athletes Type and the Average speed graph.)

All of the output of "preprocessing.ipynb" are listed below. More detail are given in the corresponding Jupyter Notebook:

* nights_recorded_activity_vs_no_activity_balanced.csv : In this files, we regrouped all the necessary features to visualise the effect of doing an activity or not on the sleep of the athletes.
* calories.csv : In this files, we regrouped all the necessary features to visualise the effect of calories on sleep.
* df_sleep_analysis_movingtime.csv : In this files, we regrouped all the necessary features to visualise the effect of Moving Time on sleep.
* motivation_by_type.csv : In this files, we regrouped all the necessary features to visualise the motivation of the user with the evolution of his moving time through the year.

Moreover, we also have inputs from the other notebook:

* activities_with_gpx.csv : contains the strava exported list with all activities + 2 column, the middle latitude and longitude gps points
* activities_with_gpx_list.csv : map with all gps points in the activities (written in csv format)
* activities_with_gpx_list.json : map with all gps points in the activities (written in json format)
* activities_with_gpx_list_small.json : compressed version of the above file

In order to plot the gpx file on a real map we had to create two more html files.

* one_activity_map.html : In order to plot the above visualization we have created a separate html page that takes an \textbf{activity\_id} parameter that identifies the activity (then it takes the appropriate gps points from the json file).
* all_activities_map.html : We do the same thing but we create an overlay with all the activity 


In the folder Js , we provide all the code in Javascript in order to make the graph:
* calendarHeatMap.js : plot the calendar graph
* geoWorldPlot.js : plot the activity on the world map
* mdb.min.js : this is the design frameworks we have used: https://mdbootstrap.com/
* mdb.min.js.map : this is the design frameworks we have used: https://mdbootstrap.com/
* overviewTableDataPlot.js: overview of the data in a table 
* treeplotActivitiesType.js: Make a treeplot with a overview of different caracteristic for each type
* average_speed_max.js : plot the average speed 
* stackedbar_chart.js : Create the graph for the motivation analysis 
* RadarChart.js : create a Radarchart which is used in the next file
* script_spiderchart.js : use the RadarChart with our data to create the athletes type graph 
* sleepBarPlot.js : TO DO 
* sleepHistogram.js:  plot basic sleep histogram plot 
* sleepStackedBarPlot.js: plot sleep vs deep sleep stacked bar plot
* actinoactiv_plot.js : In this files, we create the hexbin graph to compare the sleep of the athletes if he has done a activity or he hasn't.
* calories_plot.js : As before we observe the quality of the sleep vs calories
* movingtime_plot.js : As before we observe the quality of the sleep vs moving time.


In the folder assets, we provide different symbols that we use to compute the first visualisation of the website ( Fire, Clock, Feet, Map sympol)

Finally, all the html code necessary to compute the website are in the index.html file.


# Personal character of the data
We are aware that the data that we are going to use contains sensitive and personal information (locations, health data).As the owner of this data (Mircea Sorin-Sebastian) I fully agree to using it for this class and openly sharing all of the results. It is my intention to continue gathering more data points and publicly making them available on platforms like Kaggle.


