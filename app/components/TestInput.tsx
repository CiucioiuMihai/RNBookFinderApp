import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const TestInput = () => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Test Input (type here):</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
        editable={true}
        selectTextOnFocus={true}
        autoCapitalize="none"
        pointerEvents="auto"
      />
      <Text style={styles.display}>You typed: {text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: 'black',
    height: 40,
  },
  display: {
    marginTop: 8,
    fontSize: 14,
    color: 'gray',
  },
});

export default TestInput;
