const margin ={ top:10,right:30,bottom:30,left:60},
    width = 460 - margin.left - margin.right,
    height =400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr('width',width + margin.left+ margin.right)
    .attr("height", height + margin.top +margin.bottom)
    .append("g")
    .attr("transform",//"translate(${margin.left},${margin.top})");
    "translate("+margin.left+","+margin.top+")");

d3.csv("https://raw.githubusercontent.com/ahmaditqan/Data_Visual_Lab1/Lab3/segmented_customers.csv", function(data){

    // console.log(data);
    //compute quartiles, median, inter quartile range min and max --> these info are then used to draw the box
    var sumstat = d3.nest()// nest function allows to group the calculation per level of a factor
    .key(function (d){ return d.cluster;})
    .rollup(function (d){ 
        q1 = d3.quantile(d.map(function(item){ return item.Spending_Score;}).sort(d3.ascending),.25);
        median = d3.quantile(d.map(function(item){ return item.Spending_Score;}).sort(d3.ascending),.5);
        q3 = d3.quantile(d.map(function(item){ return item.Spending_Score;}).sort(d3.ascending),.75);
    
        interQuantileRange = q3-q1;
        min = q1 -1.5 * interQuantileRange
        max = q3 +1.5 * interQuantileRange

        return({q1:q1 , median:median, q3:q3, interQuantileRange:interQuantileRange, min:min, max:max})
    }).entries(data);
    // console.log(sumstat);

    var x = d3.scaleBand()
    .range([0,width])
    .domain(["0","1","2","3","4","5"])
    .paddingInner(1)
    .paddingOuter(.5);

    // console.log(x);

    svg
    .append("g")
    .attr("transform","translate(0,"+height+")")
    .call(d3.axisBottom(x));
    // console.log(svg);// there is a bug here //Debug

    var y = d3.scaleLinear()
    .domain([0,100])
    .range([height, 0]);

    svg
    .append("g").call(d3.axisLeft(y));
    
    //Adding the main verticle line
    svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function (d){return (x(d.key))})
    .attr("x2", function (d){return (x(d.key))})
    .attr("y1", function (d){return (y(d.value.min))})
    .attr("y2", function (d){return (y(d.value.max))})
    .attr("stroke","black")
    .style("width", 40);
    // console.log(svg);



    //Rectangle for the main box

    var boxWidth =50;

    svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function(d){ return (x(d.key)- boxWidth/2) })
    .attr("y", function(d){ return (y(d.value.q3)) })
    .attr("height", function (d){ return (y(d.value.q1)-y(d.value.q3)) })
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill","#FFA500");

    svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function(d){return (x(d.key)- boxWidth/2)})
    .attr("x2", function(d){return (x(d.key)+ boxWidth/2)})
    .attr("y1", function(d){return (y(d.value.median))})
    .attr("y2", function(d){return (y(d.value.median))})
    .attr("stroke","black")
    .style("width", 80);
});