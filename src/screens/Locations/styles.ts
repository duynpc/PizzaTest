import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    backgroundColor: 'white',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    paddingVertical: 0,
  },
  listItemContent: {
    paddingVertical: 12,
    margin: 0,
  },
  listItemDescription: {
    marginTop: 0,
  },
  rowButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -24,
  },
  iconButton: {
    margin: 0,
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});
