const fetchMenu = async () => {
    try{
        const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json')
        const data = await response.json();
        return data.menu;
    }
    catch(error) {
        console.error('Error Fetching menu:', error)
    }
}
export default fetchMenu;