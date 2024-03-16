// ==UserScript==
// @name         CurrrentMonthOfActvitiesOfAllStravaFollowers
// @namespace    https://github.com/fjungclaus
// @downloadURL  https://github.com/fjungclaus/CurrrentMonthOfActvitiesOfAllStravaFollowers/raw/main/CurrrentMonthOfActvitiesOfAllStravaFollowers.user.js
// @updateURL    https://github.com/fjungclaus/CurrrentMonthOfActvitiesOfAllStravaFollowers/raw/main/CurrrentMonthOfActvitiesOfAllStravaFollowers.user.js
// @version      1.0.1
// @description  Open a full month of actvities of all Strava followers in new tabs
// @author       Frank Jungclaus, DL4XJ
// @match        https://www.strava.com/athletes/7444656/follows*
// @grant        none
// @run-at document-idle
// ==/UserScript==


(function() {
    'use strict';

    var linkPattern = /\/athletes\/\d+/;

    var curTime = new Date();
    var month = (curTime.getMonth() + 1).toString().padStart(2, "0");
    var year = curTime.getFullYear().toString();
    var hrefLast = "";

    function openURLs(urls) {
        var index = 0;
        while(index < urls.length) {
            var newTab = window.open(urls[index], '_blank');
            if (newTab) {
                newTab.blur();
            } else {
                confirm("newTab equals null. Pop-up blocker active???");
                index = urls.length; // go home ...
            }
            index++;
        }
    }

    if (typeof(window.StravaSentry.userId) == 'undefined') {
        confirm("Can't get my Strava ID :( Exit ...");
        return;
    }

    var links = document.getElementsByTagName('a');

    var urls = [];
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.href;

        if (href.indexOf(window.StravaSentry.userId) >= 0) {
            continue;
        }

        if (href.match(linkPattern)) {
            if (href == hrefLast) {
                continue;
            }
            hrefLast = href;
            // e.g. href = href + "?num_entries=30#interval_type?chart_type=miles&interval_type=month&interval=202402&year_offset=0";
            href = href + "?num_entries=30#interval_type?chart_type=miles&interval_type=month&interval=" + year + month + "&year_offset=0";
            urls.push(href);
        }
    }

    if (confirm("Your Strava Id=" + window.StravaSentry.userId + "\nOpen all " + urls.length + " athletes\nfor date=" + year + ":" + month + "\nin new background tabs?")) {
        openURLs(urls);
    }
})();