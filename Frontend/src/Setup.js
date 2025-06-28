/*
1.Bootstrap 
  to include bootsrap use command npm i bootstrap.
  import in main.jsx file----
        import 'bootstrap/dist/css/bootstrap.min.css';



  Bootstrap has 12 grid system.
  step1:
  we have to take a div with classname container or container-fluid
  step2:
  we have to take another div with classname row
  step3:
  inside that row div we have to devide this div in 12 columns
  to deivide it we can use classes as ---
      4,4,4 -> col-4 ,col-4 , col-4
      3,3,3,3 -> col-3 ,col-3 , col-3,col-3

 
2.Routing
  run command - npm i react-router-dom
  import three components for routing
       i. BrowserRouter
       ii. Routes
       iii. Route
  
       define all routes in app.jsx
       
3.localStorage
  to store any kind of data locally in the browser
  inbuilt function : 
      i. localStorage.getItem()
      i. localStorage.setItem()
      i. localStorage.removeItem()
      i. localStorage.clear()

useState() hook : it is used to manage the state of any variable.


take an object inside useState to store the data of signup form.
use name, value for every input field to get values from input
use onChange() function to track changes on input field
each input feild has an event from which we can get input's name and value 

speard operator : ... 
...[1,2,3] => 1,2,3
...{name:'',surname:""} => name:"",surname:""

{name:""},{surname:""}
{name:"",surname:""}

[surname] : "Thakur"
{name:"Aman",surname:""}
{name:"Aman",suramne:"Thakur"}

Redux setup 

npm i @reduxjs/toolkit react-redux


we have to create slices for different data
one global store to accessd data in all screeen
createSlice() method to make a slice.
configureStore() to create global store.
useDispatch() to store data in the slice.
useSelector() to get data from slice


*/