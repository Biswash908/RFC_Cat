import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface FAQItemProps {
  question: string
  answer: string
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <View style={styles.faqContainer}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  faqContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    color: "#666",
  },
})
