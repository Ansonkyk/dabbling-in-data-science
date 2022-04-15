
async function setup(){
    console.log('lets go');
    let jsonFetch = await fetch('games_1512362753.8735218.json');
    console.log('check point ');
    let NFLData = await jsonFetch.json();
    //Sort array
    NFLData.sort(function(a, b) {
        return ((a.age < b.age) ? -1 : ((a.age == b.age) ? 0 : 1));
    });
    
    console.log(NFLData);
    let age = [];
    let won = [];
    for(let entry of NFLData){
        var temp=entry.age.split('-')
        age.push(Number(temp[0]));
        won.push(Number(entry.game_won?1:0));
    }
    console.log('check point2 ');
    console.log(age);
    console.log(won);
    var lr = linearRegression(won, age);
    console.log('checkpoint 3');
    var grouping=averagewonbyage(age,won)
    console.log(lr);
    console.log(grouping)
    const data = {
        labels: grouping[0],
        datasets: [{
          label: 'Average win',
          data: grouping[1],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      };
      
      
      const config = {
          type: 'bar',
          data: data,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },
        };
      
      
      
        const myChart = new Chart(
          document.getElementById('myChart'),
          config
        );
        let predictwinningrate=[];
        for (var i = 0; i < grouping[0].length; i++) {
            var x=Number(grouping[0][i]);
            predictwinningrate.push(Number(lr['slope'])*x+lr['intercept']);
        } 
        const data2 = {
            labels: grouping[0],
            datasets: [{
              label: 'Predict win',
              data: predictwinningrate,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                
              ],
              borderWidth: 1
            }]
          };
          
          
          const config2 = {
              type: 'line',
              data: data2,
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              },
            };
          
          
          
            const myChart2 = new Chart(
              document.getElementById('myChart2'),
              config2
            );
}

function linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += Number(x[i]);
        sum_y += Number(y[i]);
        sum_xy += Number(x[i]*y[i]);
        sum_xx += Number(x[i]*x[i]);
        sum_yy += Number(y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}

function averagewonbyage(age,won){
    var allage=[];
    var allwon=[];
    var allcount=[];
    for (var i = 0; i < won.length; i++) {
        if (allage.includes(age[i])){
            allwon[allage.indexOf(age[i])]=Number(won[i])+Number(allwon[allage.indexOf(age[i])]);
            allcount[allage.indexOf(age[i])]=Number(allcount[allage.indexOf(age[i])])+1;
            
        }else{
            allage.push(age[i]);
            allwon.push(won[i]);
            allcount.push(1);
            
        }
        
    } 
    var avgwon=[];
    console.log(allwon);//problem here red flag
    console.log(allcount);
    for (var i = 0; i < allwon.length; i++) {
        avgwon.push(Number(allwon[i])/Number(allcount[i]));
    }
    return [allage,avgwon];
}
setup();