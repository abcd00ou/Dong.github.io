var data =null ; 
$.getJSON('/static/data/test.json', function(item) {
        data =  JSON.parse(item)
        console.log(data)
    }).fail(function() {
        console.error('Error fetching JSON');
    });


    function populateDropdown(id, options) {
                const select = document.getElementById(id);
                select.innerHTML = '<option value="">Select</option>';
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.text = option;
                    select.appendChild(opt);
                });
        }

    function filterData(level) {
            if (!data) {
                console.error('Data is not loaded yet.');
                return;
            }

            const category = document.getElementById('category').value;
            const floor = document.getElementById('floor').value;
            const section = document.getElementById('section').value;

            let filteredData = [];
            if (level === 'category') {
                filteredData = data.filter(item => item['cat1'] === category);
                populateDropdown('floor', [...new Set(filteredData.map(item => item['cat2']))]);
                document.getElementById('section').innerHTML = '<option value="">Select</option>';
                document.getElementById('subsection').innerHTML = '<option value="">Select</option>';
                document.getElementById('task').innerHTML = '<option value="">Select</option>';
            } else if (level === 'floor') {
                filteredData = data.filter(item => item['cat1'] === category && item['cat2'] === floor);
                populateDropdown('section', [...new Set(filteredData.map(item => item['cat3']))]);
                document.getElementById('subsection').innerHTML = '<option value="">Select</option>';
                document.getElementById('task').innerHTML = '<option value="">Select</option>';
            } else if (level === 'section') {
                filteredData = data.filter(item => item['cat1'] === category && item['cat2'] === floor && item['cat3'] === section);
                populateDropdown('subsection', [...new Set(filteredData.map(item => item['cat4']))]);
                populateDropdown('task', [...new Set(filteredData.map(item => item['작업내용']))]);
            }
        };



    function selectOption(category, value) {
        var site = null;
        var cat1 = null;
        var cat2 = null;
        var cat3 = null;
        var cat4 = null;
        var cat5 = null;
        var cat6 = null;
        var cat7 = null;
        console.log("이걸 쓰는가?")
        if (category === 'site') {
            var site = value;

            document.getElementById('cat1Item').classList.remove('item-disable');
            const modelOptions = document.getElementById('cat1Options');
            console.log(data)
            const uniqueValues = [...new Set(data.filter(item => item['작업장명'] === value).map(item => item['중분류'].replace(" ","")))];
            console.log("uniqueValues",uniqueValues)
            modelOptions.innerHTML = uniqueValues.map(model => 
                `<li type="button" data-bs-target="#cat2Modal" data-bs-toggle="modal" onclick="selectOption('cat1','${model}')"> ${model}</li>`
            ).join('');
            document.getElementById('site').innerHTML = value;
        } else if (category === 'cat1') {
            var cat1 = value;
            var site = document.getElementById('site').textContent;
            console.log(site)
            console.log(cat1)

            document.getElementById('cat2Item').classList.remove('item-disable');
            const modelOptions = document.getElementById('cat2Options');
            console.log(data)
            const uniqueValues = [...new Set(data.filter(item => item['작업장명'] === site&&item['중분류'] === value).map(item => item['층']))];
            console.log(uniqueValues)

            modelOptions.innerHTML = uniqueValues.map(model => 
                `<li type="button" data-bs-target="#cat3Modal" data-bs-toggle="modal" onclick="selectOption('cat2','${model}')"> ${model}</li>`
            ).join('');
            console.log(document.getElementById(category + 'Options'))
            document.getElementById(category + 'Options').classList.remove('active');
            document.getElementById('cat1').innerHTML = value;
        } else if(category==="cat2"){
            var cat2 = value;
            var cat1 = document.getElementById('cat1').textContent;
            var site = document.getElementById('site').textContent;

            document.getElementById('cat3Item').classList.remove('item-disable');
            const modelOptions = document.getElementById('cat3Options');
            console.log(data)
            const uniqueValues = [...new Set(data.filter(item => item['작업장명'] === site&&item['중분류'] === cat1&&item['층'] === value).map(item => item['구간']))];
     
            console.log(uniqueValues)
            modelOptions.innerHTML = uniqueValues.map(model => 
                `<li type="button" data-bs-target="#cat4Modal" data-bs-toggle="modal" onclick="selectOption('cat3', '${model}')"> ${model}</li>`
            ).join('');
            document.getElementById('cat2').innerHTML = value;
        }else if(category==="cat3"){
            var cat3 = value;
            var cat2 = document.getElementById('cat2').textContent;
            var cat1 = document.getElementById('cat1').textContent;
            var site = document.getElementById('site').textContent;

            document.getElementById('cat4Item').classList.remove('item-disable');
            const modelOptions = document.getElementById('cat4Options');
            const uniqueValues = [...new Set(data.filter(item => item['작업장명'] === site&&item['중분류'] === cat1&&item['층'] === cat2&&item['구간'] === value).map(item => item['세부구간']))];
            console.log(uniqueValues.length)        
            uniqueValues.sort((a, b) => 
                a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
              );    
            
            modelOptions.innerHTML = uniqueValues.map(model => 
                `<li type="button" data-bs-target="#cat5Modal" data-bs-toggle="modal" onclick="selectOption('cat4', '${model}')"> ${model}</li>`
            ).join('');
            document.getElementById('cat3').innerHTML = value;
        }else if(category==="cat4"){
            var cat4 = value;
            var cat3 = document.getElementById('cat3').textContent;
            var cat2 = document.getElementById('cat2').textContent;
            var cat1 = document.getElementById('cat1').textContent;
            var site = document.getElementById('site').textContent;

            document.getElementById('cat5Item').classList.remove('item-disable');
            const modelOptions = document.getElementById('cat5Options');
            const uniqueValues = [...new Set(data.filter(item => item['작업장명'] === site&&item['중분류'] === cat1&&item['층'] === cat2&&item['구간'] === cat3&&item['세부구간'] === value).map(item => item['작업내용']))];
            console.log('cat5',uniqueValues)
            modelOptions.innerHTML = uniqueValues.map(model => 
                `<li type="button" data-bs-dismiss="modal" onclick="selectOption('cat5', '${model}')"> ${model}</li>`
            ).join('');

            const additionalInputHTML = `
                <li id='add_li'>
                    <input type="text" id="additionalInput" placeholder="보기에 없는경우 직접 입력하세요" />
                    <button type="button" onclick="addCustomOption()">작업 추가</button>
                </li>
            `;

            // 추가 입력 필드를 modelOptions 요소에 추가
            modelOptions.innerHTML += additionalInputHTML;

            document.getElementById('cat4').innerHTML = value;
        }else if(category==="cat5"){
            var cat5= value;
            document.getElementById('effort').focus();
            document.getElementById('cat6Item').classList.remove('item-disable');
            document.getElementById('cat7Item').classList.remove('item-disable');
            document.getElementById('process').value = 0;
            document.getElementById('cat5').innerHTML = value;


        }
        // Hide the current options after selection   
    }

    function onEffortClicked(num) {
        const effortElement = document.getElementById('effort');
        effortElement.value = (Number(effortElement.value) + num).toFixed(1);
    }

    function onProcessClicked(num) {
      const effortElement = document.getElementById('process');
      effortElement.value = (Number(effortElement.value) + num).toFixed(1);
  }

    function onEffortClicked_workers(num) {
        const effortElement = document.getElementById('workers_effort');
        effortElement.value = (Number(effortElement.value) + num).toFixed(1);
    }

    // 추가된 옵션을 처리하는 함수
    function addCustomOption() {
        const inputElement = document.getElementById('additionalInput');
        const newValue = inputElement.value.trim();

        if (newValue) {
            const modelOptions = document.getElementById('cat5Options');
            // 새로운 li 요소를 생성
            const newLi = document.createElement('li');
            newLi.setAttribute('type', 'button');
            newLi.setAttribute('data-bs-dismiss', 'modal');
            newLi.setAttribute('onclick', `selectOption('cat5', '${newValue}')`);
            newLi.textContent = newValue;

            // 새로운 li 요소를 add_li 요소 위에 삽입
            const addLi = document.getElementById('add_li');
            modelOptions.insertBefore(newLi, addLi);

            // 입력 필드 초기화
            inputElement.value = '';
        } else {
            alert('유효한 값을 입력하세요.');
        }
    }

    // Function to delete a row
    function deleteRow(button) {
        const row = button.parentElement.parentElement;
        row.remove();

        // Update contributions after deletion
        updateContributions();

        // Remove the table if no rows are left
        const table = document.querySelector("#dynamicTable");
        const tbody = table.querySelector("tbody");
        if (!tbody.hasChildNodes()) {
            table.remove();
        }
    };

    // Function to update contribution percentages
    function updateContributions() {
            const table = document.querySelector("#dynamicTable");
            const tbody = table.querySelector("tbody");
            const rows = tbody.querySelectorAll("tr");

            // Calculate total work
            let totalWork = 0;
            rows.forEach(row => {
                const work = parseFloat(row.cells[1].textContent);
                totalWork += work;
            });

            // Update each row's contribution
            rows.forEach(row => {
                const work = parseFloat(row.cells[1].textContent);
                const contribution = totalWork > 0 ? ((work / totalWork) * 100).toFixed(2) : 0;
                row.cells[2].textContent = `${contribution}%`;
            });
        }

        