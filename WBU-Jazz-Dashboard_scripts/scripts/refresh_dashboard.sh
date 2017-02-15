#!/bin/sh

#export PATH=$PATH:/usr/vac/bin/

#export PATH=/usr/opt/perl5/bin:$PATH

export ORACLE_HOME=/appl/DBD-Module/instantclient_12_1
export LIBPATH=$ORACLE_HOME

/appl/opt/IBM/tivoli/tipv2/profiles/TIPProfile/installedApps/TIPCell/isc.ear/OMNIbusWebGUI.war/WBU-Jazz-Dashboard/scripts/main.pl 
