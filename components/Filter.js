import { TouchableOpacity, Text, StyleSheet } from 'react-native'



const Filter = ({categories, onClick, activeCat}) => {
    const isActive = (category) => {
      if (activeCat.includes(category)) {
        return true
      } else {
        return false
      }
    }
    return (
        categories.map((category) => (
             <TouchableOpacity style={isActive(category) ? styles.filterButtonActive : styles.filterButton} onPress={() => onClick(category)} key={category}>
                 <Text style={styles.filterButtonText}>{category}</Text>
             </TouchableOpacity>
        ))
    )
}

const styles = StyleSheet.create({
    filterButton: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    backgroundColor: 'lightgray',
  },

  filterButtonActive: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#F4CE14',
  },

  filterButtonText: {
    color: '#495E57',
    fontWeight: 'bold',
  }
})

export default Filter;