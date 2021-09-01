#!/usr/bin/env bash

test() {
  str="v1.1.1-beta"
  str1=${str##*-}

  echo $str1

  str2="v1.1.1"
  str3=${str2##*-}
  echo $str3

  if [[ "$str3" == "$str2" ]]; then
    str3="release"
  fi

  echo $str3

  str4="v1.1.1-beta"
  str5=${str4%-*}
  echo $str5

  str6="v1.1.1"
  str7=${str6%-*}
  echo $str7

  str9=${str8%%-*}
  if [[ "$str9" == "$str8" && $str9 ]]; then
    echo "xxx"
  fi
  echo $str9
}

regex() {
    # Usage: regex "string" "regex"
    [[ $1 =~ $2 ]] && printf '%s %s %s\n' "${BASH_REMATCH[0]}" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
}

test_regex() {
  # regex "123" "[0-9]+" 
  # regex "v1.1.1" "^v[0-9]+\.[0-9]+\.[0-9]+-([a-z\.0-9]+)?"
  # regex "v1.1.1-beta" "^v[0-9]+\\.[0-9]+\\.[0-9]+-([a-z\\.0-9]+)?"
  regex "v1.1.1-beta.1" "^v[0-9]+\.[0-9]+\.[0-9]+-?([a-z]+)?"
  # regex "v1.1.1" "^v[0-9]+\.[0-9]+\.[0-9]+-([a-z]+)?"

  regex="^v[0-9]+\.[0-9]+\.[0-9]+-?([a-z]+)?"
  if [[ "v1.1.1-beta.2" =~ $regex ]]; then
    echo "xxx$BASH_REMATCH"
  fi

  [[ "v1.1.1-beta.2" =~ $regex ]] && echo "xxx111$BASH_REMATCH"


  CI_COMMIT_TAG="v1.1.1-beta.2"
  regex="^v[0-9]+\.[0-9]+\.[0-9]+-?([a-z]+)?"
  if [[ $CI_COMMIT_TAG =~ $regex ]]; then
    buildType=${BASH_REMATCH[1]}
    if [ -z $buildType ]; then
      buildType="release"
    fi
    export BUILD_TYPE="$buildType"
  fi

  echo $BUILD_TYPE
}

test

test_regex