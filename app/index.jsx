import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState} from "react";
import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href="/(Auth)/login" />;
};

export default index;

const styles = StyleSheet.create({});
