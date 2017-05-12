var inquirer = require("inquirer");
var mySQL = require("mysql");

var connection = mySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});








function askAction(){	
	inquirer.prompt([

	{
		type:"list",
		message: "What action would you like to take?",
		choices:["View products for sale",
					"View low inventory",
					"Add to inventory",
					"Add a new product"],
		name:"action"
	}


		]).then(function(answer){

			switch(answer.action){

				case "View products for sale":
				viewProducts();
				break;

				case "View low inventory":
				viewLowInventory();
				break;

				case "Add to inventory":
				addInventory();
				break;

				case "Add a new product":
				addProduct();
				break;
			};


		});
};



//function displays ID, Name, Price, quantity
function viewProducts(){

	var query = "SELECT * FROM products";

	connection.query(query, function(err, res){
		if (err) throw err;
		console.log("ALL INVENTORY IN PRODUCTS TABLE");
		for(i=0; i< res.length; i++){
			console.log("---|| ID "+ res[i].item_id+" ---|| NAME: "+ res[i].product_name+" ---|| PRICE: $"+ res[i].price + " ---|| QUANTITY " + res[i].stock_quantity);
		};
		askAction();
	})

};




//function displays products with inventory lower than five
function viewLowInventory(){
	var query = "SELECT * FROM products WHERE stock_quantity <= 5";
	connection.query(query, function(err, res){
		if (err) throw err;
		console.log("INVENTORY RUNNING LOW!!!!");
		for(i=0; i< res.length; i++){
			console.log("---|| ID "+ res[i].item_id+" ---|| NAME: "+ res[i].product_name+" ---|| QUANTITY " + res[i].stock_quantity);
		};
		askAction();
	})

};



//add inventory to a selected product
function addInventory(){


	inquirer.prompt([

		{
		message:"What item ID would you like to add inventory to?",
		name: "ID",
		validate: function(value){
			 	if(isNaN(value) === false){
			 		return true;
			 	}
			 	return false;
			 }
		},
		{
		message: "how much stock would you like to add?",
		name: "amount",
		validate: function(value){
			 	if(isNaN(value) === false){
			 		return true;
			 	}
			 	return false;
			 }
		}


		]).then(function(answer){
			var ID = answer.ID;
			var amount = answer.amount;
			//get the existing stock of the selected ID
			connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: ID}, function(err, res){
				if (err) throw err;

				var updatedQuantity = res[0].stock_quantity + parseFloat(amount);

				//add updated stock to the table
				connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: updatedQuantity},{item_id: ID}], function(err){
					if (err) throw err;

					console.log("--------|| The updated stock quantity for item "+ID+" is "+updatedQuantity+" ||--------");
					askAction();
				}); 

			});			
			
		});

};






function addProduct(){

	inquirer.prompt([

	{
		message: "What is the name of the item you would like to add?",
		name:"name"
	},
	{
		message: "What department would this belong to?",
		name:"department",
		choices:["home","clothing", "electronics", "sports"],
		type:"list"
	},
	{
		message: "What is the price?",
		name: "price",
		validate: function(value){
			if(isNaN(value)=== false){
				return true;
			}
			return false;
		}
	},
	{
		message:"What is your initial quantity?",
		name:"quantity",
		validate: function(value){
			if(isNaN(value)=== false){
				return true;
			}
			return false;
		}
	}


		]).then(function(answer){

			var query = "INSERT INTO products SET?";
			
			connection.query(query,{product_name: answer.name, department_name: answer.department, price: answer.price, stock_quantity:answer.quantity}, function(err){
				if (err) throw err;
				console.log("New product added");
				viewProducts();
				askAction();

			})

		})
	
};

askAction();

