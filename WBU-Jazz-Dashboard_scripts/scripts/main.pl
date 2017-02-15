#! /appl/DBD-Module/perl-5.20.0/perl

#use strict;

#use warnings;


######################
#  Global Variables  #
######################

our %conf = undef;

#####################




BEGIN {push(@INC,'/appl/DBD-Module/perl-5.20.0/lib/CPAN')}
use lib '/appl/opt/IBM/tivoli/tipv2/profiles/TIPProfile/installedApps/TIPCell/isc.ear/OMNIbusWebGUI.war/WBU-Jazz-Dashboard/scripts';

require functions;

use Shell;


$conf{'ConfFile'} = '/appl/opt/IBM/tivoli/tipv2/profiles/TIPProfile/installedApps/TIPCell/isc.ear/OMNIbusWebGUI.war/WBU-Jazz-Dashboard/scripts/global.conf';

%conf = &functions::read_confs(%conf);


print %conf;
print "\n\nGlobal Configuration File -- End\n\n";


############################################
###					 ###
###  Section: Prepare Data for Services  ###
###					 ###
############################################

print "\n\n\nSQL Query --> $conf{'ORA_SQL_SRVCS'}\n\n";

my $dbh = &functions::ConnectOracleDB($conf{'ORA_HOST'}, $conf{'ORA_SID'}, $conf{'ORA_USER'}, $conf{'ORA_PASSWORD'});

my $ServicesJson = &functions::CreateServicesJson($dbh, $conf{'ORA_SQL_SRVCS'});

print "XML FILE: $ServicesJson\n";

open FILE2, ">", "$conf{'FILE_SRVCS'}\.0" or die $!;

print FILE2 $ServicesJson;

`mv -f "$conf{'FILE_SRVCS'}\.0" "$conf{'FILE_SRVCS'}"`;


##################################################
###                                            ###
###  Section: Prepare Data for Customers JSON  ###
###                                            ###
##################################################

print "\n\n\nSQL Query --> $conf{'ORA_SQL_CSTMR'}\n\n";

my $dbh = &functions::ConnectOracleDB($conf{'ORA_HOST'}, $conf{'ORA_SID'}, $conf{'ORA_USER'}, $conf{'ORA_PASSWORD'});

my $CustomersJson = &functions::CreateCustomersJson($dbh, $conf{'ORA_SQL_CSTMR'});

print "XML FILE: $CustomersJson\n";

open FILE2, ">", "$conf{'FILE_CSTMR'}\.0" or die $!;

print FILE2 $CustomersJson;

`mv -f "$conf{'FILE_CSTMR'}\.0" "$conf{'FILE_CSTMR'}"`;


#################################################
###                                           ###
###  Section: Prepare Data for Circuits JSON  ###
###                                           ###
#################################################

print "\n\n\nSQL Query --> $conf{'ORA_SQL_CKTS'}\n\n";

my $dbh = &functions::ConnectOracleDB($conf{'ORA_HOST'}, $conf{'ORA_SID'}, $conf{'ORA_USER'}, $conf{'ORA_PASSWORD'});

my $CircuitsJson = &functions::CreateCircuitsJson($dbh, $conf{'ORA_SQL_CKTS'});

print "XML FILE: $CircuitsJson\n";

open FILE2, ">", "$conf{'FILE_CKTS'}\.0" or die $!;

print FILE2 $CircuitsJson;

`mv -f "$conf{'FILE_CKTS'}\.0" "$conf{'FILE_CKTS'}"`;


########################################################
###                                                  ###
###  Section: Prepare Data for Circuit Metrics JSON  ###
###                                                  ###
########################################################

print "\n\n\nSQL Query --> $conf{'ORA_SQL_METRICS'}\n\n";

my $dbh = &functions::ConnectOracleDB($conf{'ORA_HOST'}, $conf{'ORA_SID'}, $conf{'ORA_USER'}, $conf{'ORA_PASSWORD'});

my $CircuitMetricsJson = &functions::CreateCircuitMetricsJson($dbh, $conf{'ORA_SQL_METRICS'});

print "XML FILE: $CircuitMetricsJson\n";

open FILE2, ">", "$conf{'FILE_METRICS'}\.0" or die $!;

print FILE2 $CircuitMetricsJson;

`mv -f "$conf{'FILE_METRICS'}\.0" "$conf{'FILE_METRICS'}"`;


########################################################
###                                                  ###
###  Section: Prepare Data for Customer Alarms JSON  ###
###                                                  ###
########################################################

print "\n\n\nSQL Query --> $conf{'ORA_SQL_CSTMR_2'}\n\n";

my $dbh = &functions::ConnectOracleDB($conf{'ORA_HOST'}, $conf{'ORA_SID'}, $conf{'ORA_USER'}, $conf{'ORA_PASSWORD'});

my $CustomerAlarmsJson = &functions::CreateCustomerAlarmsJson($dbh, $conf{'ORA_SQL_CSTMR_2'});

print "XML FILE: $CustomerAlarmsJson\n";

open FILE2, ">", "$conf{'FILE_CSTMR_2'}\.0" or die $!;

print FILE2 $CustomerAlarmsJson;

`mv -f "$conf{'FILE_CSTMR_2'}\.0" "$conf{'FILE_CSTMR_2'}"`;


#	sleep($conf{'DaemonWait'});



