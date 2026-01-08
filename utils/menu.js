
export async function fetchMenu() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
        const data = await response.json();
        return data.menu;
    } catch (error) {
        console.error('Error Fetching menu:', error);
        return [];
    }
}

export async function getCategories() {
    const menu = await fetchMenu();
    const categories = [];
    menu.forEach((item) => {
        if (!categories.includes(item.category)) {
            categories.push(item.category);
        }
    });
    return categories;
}
