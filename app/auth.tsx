import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";

import { TextInput, Text, Button, useTheme } from "react-native-paper";
export default function AuthScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp, isLoadingUser } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (isSignup) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
      router.replace("/");
    }
    setError("");

    console.log(email, password);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignup ? "Create Account" : "Welcome Back"}
        </Text>

        <TextInput
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignup ? "Sign Up" : "Sign In"}
          {isLoadingUser ? "..." : ""}
        </Button>
        <Button
          mode="text"
          onPress={() => setIsSignup(!isSignup)}
          style={styles.switchButton}
        >
          {isSignup
            ? "Already have an account? Sign In"
            : "Don't have and account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "$f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchButton: {
    marginTop: 16,
  },
});
