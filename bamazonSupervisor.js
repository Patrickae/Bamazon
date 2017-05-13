var inquirer = require("inquirer");
var mySQL = require("mysql");
var Table = require('cli-table');

var connection = mySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});


function start(){	
	inquirer.prompt([

	{
		type:"list",
		message: "What action would you like to take?",
		choices:["View sales by department",
					"Create new department"],
		name:"action"
	}


		]).then(function(answer){

			switch(answer.action){

				case "View sales by department":
				viewDepartments();
				break;

				case "Create new department":
				createDepartment();
				break;
			};

		});
};


function viewDepartments(){
	connection.query("SELECT * FROM departments",function(err,res){
		if (err) throw err;

		var table = new Table({
  		  head: ['ID', 'Department Name', 'Overhead Cost', 'Total Sales', 'Profit']
  		, colWidths: [10, 15, 15, 15, 10]
		});

		for(i=0; i<res.length; i++){

			var profit = res[i].total_sales - res[i].over_head_cost;
			table.push([res[i].department_id, res[i].department_name, res[i].over_head_cost, res[i].total_sales, profit] );
		};
		console.log(table.toString());
		start();
	})
};




function createDepartment(){
	

	inquirer.prompt([

	{
		message: "What is the name of the department?",
		name:"name"
	},
	
	{
		message: "What is the overhead cost?",
		name: "cost",
		validate: function(value){
			if(isNaN(value)=== false){
				return true;
				}
				return false;
				}
	}
	


		]).then(function(answer){

			var query = "INSERT INTO departments SET?";
			
			connection.query(query,{department_name: answer.name, over_head_cost: answer.cost, total_sales: 0 }, function(err){
				if (err) throw err;
				console.log("New department added!");
				viewDepartments();
				

			});

		});
	
};




start();






