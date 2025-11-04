import { useAuth } from "@/context/auth-context";
import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/login">Go to Login Screen</Link>
      <Button mode="contained" onPress={signOut} icon={"logout"}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
