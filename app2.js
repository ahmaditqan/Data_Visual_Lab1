const margin ={ top:10,right:30,bottom:30,left:60},
    width = 500 - margin.left - margin.right,
    height =400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr('width',width + margin.left+ margin.right +100)
    .attr("height", height + margin.top +margin.bottom)
    .append("g")
    .attr("transform",//"translate(${margin.left},${margin.top})");
    "translate("+margin.left+","+margin.top+")");

d3.csv("segmented_customers.csv", function (data) { 
    //Add x axis
    var x = d3.scaleLinear()
    .domain([0,100])
    .range([0,width]);

    svg
    .append("g")
    .attr("transform","translate(0,"+height+")")
    .call(d3.axisBottom(x));

    // console.log(svg);
    //Add y axis
    var y = d3.scaleLinear()
    .domain([0,100])
    .range([height,0]);

    svg
    .append('g')
    .call(d3.axisLeft(y));

    //Add label on x axis
    svg
    .append('text')
    .text('Age')
    .attr('x',430)
    .attr('y',370)

    //Add label on y axis
    svg
    .append('text')
    .text('Spending score')
    .attr("transform","translate(-38,100)rotate(90)")
    // .style("transform","")

    

    var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity",0)
    .attr("class","tooltip")
    .style("background-color","white")
    .style("border","solid")
    .style("border-width","2px")
    .style("border-radius","5px")
    .style("padding","10px")
    .style("position","absolute")

    var mouseover = function(d) { 
        tooltip 
        .style("opacity", 1) 
    }

    var mousemove = function(d) { 
        tooltip 
        .html("The exact value of<br>the age is: " + d.Age) 
        .style("left", (d3.mouse(this)[0]+90) + "px") 
        .style("top", (d3.mouse(this)[1]) + "px")
     }

    var mouseleave = function(d) { 
        tooltip 
        .transition() 
        .duration(200) 
        .style("opacity", 0) 
    }

    svg
    .append("g")
    .selectAll("dot")
    .data(data.filter(function(d,i){return i<50}))
    .enter()
    .append("circle")
    .attr("cx", function (d) {return x(d.Age);})
    .attr("cy", function (d) {return y(d.Spending_Score);})
    .attr('r',4.5)
    .style("fill","#312E9A")
    .style("opacity", 0.6)
    .style("stroke","white")
    .on("mouseover",mouseover)
    .on("mousemove",mousemove)
    .on("mouseleave",mouseleave)
     

});

