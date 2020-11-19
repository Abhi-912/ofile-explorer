
//loop through children of tbody
const children = $('tbody').children();

//convert children to an array
let children_array = [];
for(let i = 0; i < children.length; i++) {
	children_array.push(children[i]);
}

console.log(children_array);

//build an array of object
const items = [];
children_array.forEach(element => {
	//console.log(element.outerHTML);
	//console.log(element.getAttribute('data-name'));
	const rowdetails = {
		name : element.getAttribute('data-name'),
		size : parseInt(element.getAttribute('data-size')),
		time : parseInt(element.getAttribute('data-time')),
		html : element.outerHTML
	};
	items.push(rowdetails);
});

//Const sort status object
const sortstatus = {
    name : 'none',
    size : 'none',
    time : 'none'
};

const sort = (items, option, type) => {
    items.sort((item1, item2) => {
        let value1, value2;
        if(type === 'name'){
            value1 = item1.name.toUpperCase();
            value2 = item2.name.toUpperCase();
        }else if(type === 'size'){
            value1 = item1.size;
            value2 = item2.size;
        }else{
            value1 = item1.time;
            value2 = item2.time;
        }
        if(value1 < value2){
            return -1;
        }
        if(value1 > value2){
            return 1;
        }
        //equal values
        return 0;
    });

    //reverse the array if the option is down
    if(option === 'down'){
        items.reverse();
    }
};


//fill table body with items
const fill_table_body = items => {
	const content = items.map(element => element.html).join('');
	//console.log(content);
	$('tbody').html(content);
}


document.getElementById('table_head_row').addEventListener('click', event =>{
    if(event.target){
        //clear icons
        $('ion-icon').remove();

        if(['none', 'down'].includes(sortstatus[event.target.id])){
            //sort in ascending order
            sort(items, 'up', event.target.id);
            sortstatus[event.target.id] = 'up';
            //add icon
            event.target.innerHTML += '<ion-icon name="caret-up-outline"></ion-icon>';
        }
        else if(sortstatus[event.target.id] === 'up'){
            //sort in descending order
            sort(items, 'down', event.target.id);
            sortstatus[event.target.id] = 'down';
            //add icon
            event.target.innerHTML += '<ion-icon name="caret-down-outline"></ion-icon>';
        }
        fill_table_body(items);
    }
});
