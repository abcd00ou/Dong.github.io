function tableData() {
  var data = document.createElement("div");

  data.setAttribute("id", "tableCont");

  data.innerHTML = `<div id="bgtables">
    <h1>작업 생산성</h1>
  </div>

  
 <div id="sorting">
   <div class="sort1">
     <label for=""><i>작업장명</i></label>
      <select id="sort" onchange="change1()">
      <option name="마곡CP" value="마곡CP">마곡CP League</option>
      <option name="송도" value="송도">송도</option>
      <option name="시흥" value="시흥">시흥</option>
      <option name="당진" value="당진">당진</option>
    </select>

   </div>
   <div class="sort1">          <label for=""><i>Filter by Season</i></label>
      <select id="sort2" onchange="changeTwo()">
      <option name="Season" value="Season">All Season</option>
      <option name="2020/21" value="2020/21">2020/21</option>
      <option name="2019/20" value="2019/20">2019/20</option>
           <option name="2018/19" value="2018/19">2018/19</option>
      <option name="2017/18" value="2017/18">2017/18</option>     <option name="2016/17" value="2016/17">2016/17</option>
      <option name="2015/16" value="2015/16">2015/16</option>     <option name="2014/15" value="2014/15">2014/15</option>
      <option name="2013/14" value="2013/14">2013/14</option>     <option name="2012/13" value="2012/13">2012/13</option>
      <option name="2011/12" value="2011/12">2011/12</option>     <option name="2010/11" value="2010/11">2010/11</option>
      <option name="2009/10" value="2009/10">2009/10</option>     <option name="2008/09" value="2008/09">2008/09</option>
      <option name="2007/08" value="2007/08">2007/08</option>     <option name="2006/07" value="2006/07">2006/07</option>
      <option name="2005/06" value="2005/06">2005/06</option>     <option name="2004/05" value="2004/05">2004/05</option>
      <option name="2003/04" value="2003/04">2003/04</option>     <option name="2002/03" value="2002/03">2002/03</option>
      <option name="2001/02" value="2001/02">2001/02</option>     <option name="2000/01" value="2000/01">2000/01</option>
      <option name="1999/00" value="1999/00">1999/00</option>     <option name="1998/99" value="1998/99">1998/99</option>
      <option name="1997/98" value="1997/98">1997/98</option>     <option name="1996/97" value="1996/97">1996/97</option>
      <option name="1995/96" value="1995/96">1995/96</option>     <option name="1994/95" value="1994/95">1994/95</option>
      <option name="1993/94" value="1993/94">1993/94</option>     <option name="1992/93" value="1992/93">1992/93</option>      
</select></div>
   <div class="sort1">
          <label for=""><i>Filter by Matchweeks</i></label>
      <select id="sort3" onchange="changeThree()">
      <option name="AllMatchweeks" value="AllMatchweeks">All Matchweeks</option>
      <option name="1" value="1">1</option>
      <option name="2" value="2">2</option>
           <option name="3" value="3">3</option>
      <option name="4" value="4">4</option>     <option name="5" value="5">5</option>
      <option name="6" value="6">6</option>     <option name="7" value="7">7</option>
      <option name="8" value="8">8</option>     <option name="9" value="9">9</option>
      <option name="10" value="10">10</option>     <option name="11" value="11">11</option>
      <option name="12" value="12">12</option>     <option name="13" value="13">13</option>
      <option name="14" value="14">14</option>     <option name="15" value="15">15</option>
      <option name="16" value="16">16</option>     <option name="17" value="17">17</option>
      <option name="18" value="18">18</option>     <option name="19" value="19">19</option>
      <option name="20" value="20">20</option>     <option name="21" value="21">21</option>
      <option name="22" value="22">22</option>     <option name="23" value="23">23</option>
      <option name="24" value="24">24</option>     <option name="25" value="25">25</option>
      <option name="26" value="26">26</option>     <option name="27" value="27">27</option>
      <option name="28" value="28">28</option>     <option name="29" value="29">29</option>
      <option name="30" value="30">30</option>     <option name="31" value="31">31</option>
      
</select>
   </div>
   <div class="sort1">
     <label for=""><i>Filter by Home or Away</i></label>
      <select id="sort4" onchange="changeFour()">
      <option name="AllMatches" value="AllMatches">All Matches</option>
      <option name="Home" value="Home">Home</option>
      <option name="Away" value="Away">Away</option>
</select></div>
   <div style="float: right;color: grey;padding-top:15px" id="resetbtn">
<i class="material-icons" style="float:left;margin-right:5px">&#xe5d5;</i>  Reset Filters</div>
 </div>

 
  
<img src="./static/img/premier/footlogo.png" alt="" style="width:100px;margin-left: 100px;margin-top:30px;margin-bottom:30px">
  

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


