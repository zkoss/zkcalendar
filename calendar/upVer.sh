#!/bin/bash
maindir="$(pwd)"
echo "Working directory $maindir"
oldVersion=$1
newVersion=$2
isFL=$3
echo "isFL $isFL"
if [ "$oldVersion" == "" ] || [ "$newVersion" == "" ] ; then
	echo "Usage: upVer [ oldVersion ] [ newVersion ] [options]"
	echo "Available options: FL."
	exit 1
fi

function upVer {
	if [ "$isFL" == "FL" ] ; then
		sed -i "/version>/,/<\//s/>$oldVersion.*<\//>$newVersion-SNAPSHOT<\//" $1/pom.xml
		echo "$1 pom.xml"
		grep -n --color=auto $newVersion"-SNAPSHOT" $1/pom.xml
	else
		sed -i "/version>/,/<\//s/>$oldVersion.*<\//>$newVersion<\//" $1/pom.xml
		echo "$1 pom.xml"
		grep -n --color=auto $newVersion $1/pom.xml
	fi

	echo "$1 MANIFEST.MF"
	find src -name MANIFEST.MF -exec sed -i "s/$oldVersion.*/$newVersion/g
	" {} \; -exec grep -n --color=auto $newVersion {} \;

	echo "$1 config.xml"
	find src -name config.xml -exec sed -i "
	/<version/,/\/version>/s/>$oldVersion.*<\//>$newVersion<\//g
	" {} \; -exec grep -n --color=auto $newVersion {} \;

	echo "$1 lang.xml"
	find src -name lang.xml -exec sed -i "
	/<version/,/\/version>/s/>$oldVersion.*<\//>$newVersion<\//g
	" {} \; -exec grep -n --color=auto $newVersion {} \;

	echo "$1 lang-addon.xml"
	find src -name lang-addon.xml -exec sed -i "
	/<version/,/\/version>/s/>$oldVersion.*<\//>$newVersion<\//g
	" {} \; -exec grep -n --color=auto $newVersion {} \;

	find src -name lang-addon.xml -exec sed -i -E "
	s/(\<javascript\-module.*version\=\")$oldVersion.*(\")/\1$newVersion\2/
	" {} \; -exec grep -n --color=auto $newVersion {} \;

	echo "$1 Version.java"
	find src -name Version.java -exec sed -i "
	s/UID = \"$oldVersion.*\";/UID = \"$newVersion\";/g
	" {} \; -exec grep -n --color=auto $newVersion {} \;
}

if [ "$isFL" == "FL" ] ; then
  sed -i "/version>/,/<\//s/>$oldVersion.*<\//>$newVersion-SNAPSHOT<\//" pom.xml
  echo "$1 pom.xml"
  grep -n --color=auto $newVersion"-SNAPSHOT" $1/pom.xml
else
  sed -i "/version>/,/<\//s/>$oldVersion.*<\//>$newVersion<\//" pom.xml
  echo "$1 pom.xml"
  grep -n --color=auto $newVersion $1/pom.xml
fi

for d in */; do
    upVer $d
done

# Update poi/build.gradle
if [ -f poi/build.gradle ] ; then
  echo "poi/build.gradle"
  find ./poi/build.gradle -exec sed -i "
  s/version = '$oldVersion.*'/version = '$newVersion'/g
  " {} \; -exec grep -n --color=auto $newVersion {} \;
fi