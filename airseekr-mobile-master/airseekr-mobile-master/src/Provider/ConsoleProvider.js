
import React from 'react';
class ConsoleProvider {
	//----------------- message buttons
      consolelog(key,message)
         {
           return console.log(key,message)
         }
}
export const consolepro = new ConsoleProvider();