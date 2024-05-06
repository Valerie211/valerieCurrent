export const getTime =(time)=>{
    
const dateTime = new Date(time);
const timeString = dateTime.toTimeString().split(' ')[0]; 
return timeString
}