import json, sys
from time import strftime

#Checking user environment for presence of library.

try:
	import requests
except ImportError:
	sys.exit('Please install requests pacakge for running this script! \n' + 
		'Possible installation method - pip install requests')

#Function to send a GET request to the MediaWiki API for the query and parse it
def retrieve_url(search_query):
	
	search_query = search_query.split()
	search_query = '+'.join(search_query)

	try:
		request_object = requests.get('https://en.wikipedia.org/w/api.php?action'
			+'=opensearch&imlimit=1&format=json&search='+query)
	except requests.exceptions.RequestException:
		sys.exit('Network Error! Try again later!')
	
	#Parsing JSON
	query_response = json.loads(request_object.content)[-1]
	

	#Checking to see if page exists. None is returned if it doesn't
	if len(query_response) == 0:
		return None
	else:
		return query_response[0]		


len_args = len(sys.argv)
flag = 0

#Pipe mode - Checking if phone number is given as an arguement
if len_args >= 3:
	log_file_path = sys.argv[1]
	query = ' '.join(sys.argv[2:])

#ClI mode - Asking user for input 
elif len_args == 2:
	log_file_path = sys.argv[1]
	query = raw_input('Enter word(s) to search for :').strip()
	flag = 1

#ClI mode - Asking user for input and default log file
else:
	log_file_path = 'log.txt'
	query = raw_input('Enter word(s) to search for :').strip()
	flag = 1


query_response = retrieve_url(query.strip())


#Log format
if query_response == None:
	query_log = strftime("%Y-%m-%d %H:%M:%S") + ' ' + query + ' ' + 'Page Not'+
	 ' Found' + '\n'
else:
	query_log = strftime("%Y-%m-%d %H:%M:%S") + ' ' + query + ' ' +
	 query_response + '\n'

#Printing on console if CLI mode
if(flag == 1):
	if query_response == None:
		print 'Link not found for search!'
	else:
		print query_response

#Writing to log file
try:
	log_file = open(log_file_path, 'a')
	log_file.write(query_log)
	print 'Logged to file : ' + log_file_path
	log_file.close()
except IOError:
	sys.exit('IOError! Try again!')




