function tableData() {
  var data = document.createElement("div");

  data.setAttribute("id", "tableCont");

  data.innerHTML = `<div id="bgtables" >
    <h1>작업 생산성</h1>
  </div>

<img src="./static/img/premier/footlogo.png" alt="" style="width:100px;margin-left: 100px;margin-top:10px;margin-bottom:10px">
  

<div id="scores">
  <label for="" style="margin-left: 25px;">More</label>  
  <label for="" style="margin-left: 20px;">Position</label>
  <label for="" style="margin-left: 50px;">Club</label>
  <label for="" style="margin-left: 310px;">Played</label>
  <label for="" >Won</label>
  <label for="">Drawn</label>
  <label for="">Lost</label>
  <label for="">GF</label>
  <label for="">GA</label>
  <label for="">Points</label>
  <label for=""style="margin-left: 100px;">From</label>
  <label for="" style="float: right;margin-right: 20px;">Next</label>
</div>

`;

  async function teams() {
    var res = await fetch("./static/data/points_table_old.json");
    var data = await res.json();

    // console.log(data);

    let { records } = data;
    console.log('records',records);

    var displayScore = document.getElementById("bodyContent");
    for (var i = 0; i < records.length; i++) {
      console.log(records[i]);
      console.log(i);

      var div = document.createElement("div");
      div.setAttribute("id", "scoreDetails");
      console.log(records[i].icon)
      div.innerHTML = `
<span style='font-size:14px;'>&#8744;</span> <label id="lbl1"> ${[
        i + 1,
      ]}&nbsp;&nbsp;•</label> <label  id="lbl2" ><img src="./static/img/premier/img_icon${
        i+1
      }.png" style="float:left;margin-right:15px;padding-bottom:20px; width:25px"/> <span>${
        records[i].team
      }</span></label>
      <label id="lbl3">${records[i].played}</label><label id="lbl4">${
        records[i].win
      }</label><label id="lbl5">${records[i].draw}</label><label id="lbl6">${
        records[i].loss
      }</label><label id="lbl7">${
        records[i].goalsFor
      }</label><label id="lbl8">${
        records[i].goalsAgainst
      }</label><label id="lbl10" style="font-weight: bold">${
        records[i].points
      }</label><label id="lbl11"><img src="./static/img/premier/img_icon${
        records.length-i
      }.png" style="float:left;margin-right:15px;padding-bottom:20px; width:25px"/>
      </label><label id="lbl12"><img src="./static/img/premier/rank${
        i+1
      }.png" width:25px/></label>`;

      displayScore.appendChild(div);
    }
  }

  

  teams();

  return data;
}

document.getElementById("bodyContent").appendChild(tableData());
export default tableData;


