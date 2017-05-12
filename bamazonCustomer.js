var inquirer = require("inquirer");
var mySQL = require("mysql");

var connection = mySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});


function start(){

	connection.query("SELECT * FROM products", function(err,res){
		if (err) throw err;
				for (i=0; i<res.length; i++){
			console.log("|| ID: "+res[i].item_id+" || " + res[i].product_name +" || $" + res[i].price + "||");
		};
	});
	setTimeout(interface, 500);
};


function interface(){

	

	inquirer.prompt ([

	{	
		message:"what is the ID of the item you would like to purchase?",
		name:"ID",
			validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	  	}
	},


	{
		message: "How many would you like to purchase?",
		name: "amount",
			validate: function(value){
				if(isNaN(value) === false){
					return true;
				}
				return false;
				}
		
	}


		]).then(function(answers){
			var ID = answers.ID;
			var amount = answers.amount;

			connection.query("SELECT * FROM products WHERE ?",{item_id: ID}, function(err,res){
				if (err) throw err;


				if(res[0].stock_quantity > amount){
					console.log("--------Total Price: $"+res[0].price * amount+"------------");
					var updatedQuantity = res[0].stock_quantity - amount;

					connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: updatedQuantity},{item_id: ID}], function(err){
							if (err) throw err;
							console.log("-----updated quantity "+ updatedQuantity+"---------");
									});

				}else{
					console.log("Sorry, there are only " + res[0].stock_quantity +" of this item in stock");
					
				};

				


				

				


			});

			setTimeout(start, 1000);

		});

	
};



start();


