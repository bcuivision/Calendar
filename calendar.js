// array of month names 
const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER","NOVEMBER", "DECEMBER"];

(function () {
    "use strict";

    /* Date.prototype.deltaDays(n)
     * 
     * Returns a Date object n days in the future.
     */
    Date.prototype.deltaDays = function (n) {
        // relies on the Date object to automatically wrap between months for us
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
    };

    /* Date.prototype.getSunday()
     * 
     * Returns the Sunday nearest in the past to this date (inclusive)
     */
    Date.prototype.getSunday = function () {
        return this.deltaDays(-1 * this.getDay());
    };
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *  .nextWeek() returns a Week object sequentially in the future
 *  .prevWeek() returns a Week object sequentially in the past
 *  .contains(date) returns true if this week's sunday is the same
 *      as date's sunday; false otherwise
 *  .getDates() returns an Array containing 7 Date objects, each representing
 *      one of the seven days in this month
 */

function Week(initial_d) {
    "use strict";

    this.sunday = initial_d.getSunday();
        
    this.nextWeek = function () {
        return new Week(this.sunday.deltaDays(7));
    };
    
    this.prevWeek = function () {
        return new Week(this.sunday.deltaDays(-7));
    };
    
    this.contains = function (d) {
        return (this.sunday.valueOf() === d.getSunday().valueOf());
    };
    
    this.getDates = function () {
        var dates = [];
        for(var i=0; i<7; i++){
            dates.push(this.sunday.deltaDays(i));
        }
        return dates;
    };
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *  .year == the year associated with the month
 *  .month == the month number (January = 0)
 * 
 * Functions (Methods):
 *  .nextMonth() returns a Month object sequentially in the future
 *  .prevMonth() returns a Month object sequentially in the past
 *  .getDateObject(d) returns a Date object representing the date
 *      d in the month
 *  .getWeeks() returns an Array containing all weeks spanned by the
 *      month; the weeks are represented as Week objects
 */

function Month(year, month) {
    "use strict";
    
    this.year = year;
    this.month = month;
    
    this.nextMonth = function () {
        return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
    };
    
    this.prevMonth = function () {
        return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
    };
    
    this.getDateObject = function(d) {
        return new Date(this.year, this.month, d);
    };
    
    this.getWeeks = function () {
        var firstDay = this.getDateObject(1);
        var lastDay = this.nextMonth().getDateObject(0);
        
        //console.log(firstDay);

        var weeks = [];
        var currweek = new Week(firstDay);
        weeks.push(currweek);
        while(!currweek.contains(lastDay)){
            currweek = currweek.nextWeek();
            weeks.push(currweek);
        }
        
        return weeks;
    };
}

// Initial setup of current month
var today = new Date();
var currentMonth = new Month(today.getFullYear(), today.getMonth());

// storing the month DOM
let monthDOM = document.getElementById("month");

//initial set current month & year
month.innerText = months[currentMonth.month] + ", " + currentMonth.year;

//display initial calendar view
updateCalendar(); 

// Change the month when the "previous" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event)
{
    currentMonth = currentMonth.prevMonth();
    updateCalendar();
    //console.log("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event)
{
    currentMonth = currentMonth.nextMonth(); 
    updateCalendar(); 
    //console.log("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

// This updateCalendar() modify the DOM to display the days and weeks in the current month.
function updateCalendar()
{
    //setting the current month and year of the calendar using month DOM
    monthDOM.innerText = months[currentMonth.month] + ", " + currentMonth.year;

    var weeks = currentMonth.getWeeks();
    
    let i = 0;
    for(var w in weeks)
    {
        //accessing elements in html
        var weeksDOM = document.getElementsByClassName("weeks")[i];

        var daysDOM = weeksDOM.children;
        var j = 0;

        var days = weeks[w].getDates();
        //console.log("Week starting on "+days[0]);
        
        for(var d in days)
        {
            let dateElement = document.createElement("div");
            
            let dateDOMExist = daysDOM[j].children.length;
            if(dateDOMExist!=0)
            {
                dateElement = daysDOM[j].children[0];
                dateElement.innerText = days[d].toISOString().substring(8,10);
            }
            else
            {
                dateElement.classList.add("dates");
                dateElement.innerText = days[d].toISOString().substring(8,10);
                daysDOM[j].appendChild(dateElement);
            }

            daysDOM[j].id = days[d].toISOString().substring(0,10);

            j = j+1;
        }

        i = i+1;
    }
}

