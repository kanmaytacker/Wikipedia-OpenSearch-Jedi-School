/*
	Program to retreive a Wikipedia Link for a search term(s) received as input 
	either in pipe mode or CLI and log it to file
*/



var fs = require('fs')


//Checking user environment for presence of library.

try{
	var request = require('request')
	
}
catch(exception){
	console.log('Please install request pacakge for running this script! \n'+
		'Possible installation method - npm install request')
	process.exit(exception.code)
}

try{
	var prompt = require('prompt')
}
catch(exception){
	console.log('Please install request pacakge for running this script! \n'+ 
		'Possible installation method - npm install prompt')
	process.exit(exception.code)
}


var len_args = process.argv.length
var query, flag = 0

//Pipe mode - Checking if phone number is given as an arguement
if (len_args >= 4){
	log_file_path = process.argv[2]
	query = process.argv.slice(3, len_args).join(' ')
	link = RetrieveDataAndWrite(query)
	
}

//ClI mode - Asking user for input 
else if(len_args <= 3){
	if(len_args == 3){
		log_file_path = process.argv[2]
	}
	else{
		log_file_path = 'log.txt'
	}

	flag = 1
	prompt.start()
	prompt.get('query', function(err, result){
		query = result.query
		RetrieveDataAndWrite(query)


	})

}


/*
	Function to send a GET request to the MediaWiki API for the query and parse
	it and then write it to the log file
*/
function RetrieveDataAndWrite(search_query){ 
	query = search_query.split(' ').join('+')
	request('https://en.wikipedia.org/w/api.php?action=opensearch&imlimit=1&'+
		'format=json&search='+query, function(error, response, body){
		if(error){
			console.log('Error : ' + error )
			return 0
		}
		//Parsing JSON
		data = JSON.parse(body)
		links = data[data.length -1]
		
		//Checking to see if page exists. None is returned if it doesn't separate return
		var datetime = new Date()
		if(links.length == 0){
			response = datetime + ' ' + search_query + ' Link not found for' + 
			' search! \n'	
		}
		else{
			response = datetime + ' ' + search_query + ' ' + links[0] + '\n'
			
		}
		//Printing on console if CLI mode
		if(flag == 1){
			console.log(response)
		}

		//Writing to log file
		fs.appendFile(log_file_path, response, function(err){
				if(err)
					console.log(err)
				else
					console.log('Logged to file : ' + log_file_path)
			})
		
		return 0
		
	})
}
