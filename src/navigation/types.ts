import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  ProfileSelect: undefined;
  KidTabs: undefined;
  ParentTabs: undefined;
};

export type DiaryStackParamList = {
  DiaryMenu: undefined;
  DiaryMic: undefined;
  DiaryEvac: undefined;
  Alarms: undefined;
};

export type GamesStackParamList = {
  GamesHub: undefined;
  RocketGame: undefined;
  BalloonGame: undefined;
  FrogGame: undefined;
};

export type KidTabParamList = {
  Home: undefined;
  Diary: NavigatorScreenParams<DiaryStackParamList> | undefined;
  Games: NavigatorScreenParams<GamesStackParamList> | undefined;
  Learn: undefined;
  Store: undefined;
};

export type ParentTabParamList = {
  Overview: undefined;
  Diary: undefined;
  Chart: undefined;
  Report: undefined;
  Settings: undefined;
};

export type GamesStackParamList = {
  GamesHub: undefined;
  RocketGame: undefined;
  BalloonGame: undefined;
  FrogGame: undefined;
};

export type DiaryStackParamList = {
  DiaryMenu: undefined;
  DiaryMic: undefined;
  DiaryEvac: undefined;
  Alarms: undefined;
};

export type ParentTabParamList = {
  Overview: undefined;
  Diary: undefined;
  Chart: undefined;
  Report: undefined;
  Settings: undefined;
};
