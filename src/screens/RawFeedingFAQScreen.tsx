import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native"
import { FAQItem } from "../components/shared/FAQItem"
import { rawFeedingFaqs } from "../constants/faq-data"

const RawFeedingFAQScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.container}>
        {rawFeedingFaqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    padding: 16,
  },
})

export default RawFeedingFAQScreen
