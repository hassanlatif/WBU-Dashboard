package functions;


use POSIX qw/strftime/;
use Shell;
use DBI;

#use File::Stat::Ls;
#use File::DirList;


sub file_exists()	{
my($filename)= @_;
	if(-e $filename)	{
		return 1;
	}
	else	{
		return 0;
	}
}

sub get_file_content()  {
my ($filename) = @_;

	#print "-----$filename\n";
	if(&file_exists($filename))	{
		open(PAGE,$filename) || die "File can't open: $filename";
		@File = <PAGE>;
		close(PAGE);
		return(@File);
	}
	else	{
		print "File not exists";
	}
}

sub read_confs()     {
my(%conf) = @_;
        @File = &get_file_content($conf{'ConfFile'});
	#print "@File";
        foreach my $line (@File)        {
                chomp($line);
                $line =~ s/#.*//g;
                $line =~ s/^ //g;
                $line =~ s/\t//g;
                if($line !~ // && $line =~ /:/) {
                    ($key, $value) = split(":",$line);
		    $key =~ s/\s//g;
                    $value =~ s/"//g;
                    $conf{$key} = $value;
                    print "$key-->$props{$key}\n";
                }
        }
	return(%conf);
}


######################################
##  Function: ConnectOracleDB(...)  ##
######################################

sub ConnectOracleDB()	{
my($ORA_HOST, $ORA_SID, $ORA_USER, $ORA_PASSWORD) = @_;

 
	# Get a database handle by connecting to the database
	$dbh = DBI->connect("dbi:Oracle:host=$ORA_HOST;sid=$ORA_SID", "$ORA_USER","$ORA_PASSWORD", {RaiseError => 1, AutoCommit => 1}) or die "Can't connect to database: $DBI::errstr\n";

	return($dbh);
}


######################################
##  Function: QueryOracleDB(...)    ##
######################################

sub QueryOracleDB()	{
my($dbh, $ORA_SQL_CMD) = @_;

	# Instead you could do $dbh->do($sql) or execute
	$sth = $dbh->prepare($ORA_SQL_CMD) or die "Can't prepare statement: $dbh->errstr\n";
	$sth->execute() or die "Can't execute statement: $sth->errstr\n";


	my %HashDB = undef;

	
	# Convert Array
	while (@rows = $sth->fetchrow_array()) {
		$HashDB{$rows[0]} = "$rows[1]";
		print "QueryOracleDB() --> $rows[0], rows[1]";
	}
	delete($HashDB{''});

	$sth->finish();
	$dbh->disconnect();
	return(%HashDB);
}

###########################################
##  Function: CreateServicesJson(...)    ##
###########################################

sub CreateServicesJson() {
        
	my($dbh, $ORA_SQL_CMD) = @_;
        
        # Instead you could do $dbh->do($sql) or execute
        $sth = $dbh->prepare($ORA_SQL_CMD) or die "Can't prepare statement: $dbh->errstr\n";
        $sth->execute() or die "Can't execute statement: $sth->errstr\n";

        print "\nCreating Services JSON...\n";

	$/ = ',';

        my $JsonStr = "{ \"services\": { ";

	$Cat1Str = "Data";
	$Cat2Str = "Voice";
	$Cat3Str = "Capacity";
	$Cat4Str = "All";

	$DataJsonStr .= "\"$Cat1Str\": [ ";
	$VoiceJsonStr .= "\"$Cat2Str\": [ ";
	$CapacityJsonStr .= "\"$Cat3Str\": [ ";
	$AllJsonStr .= "\"$Cat4Str\": [ ";

        # Convert Array to JSON String Row-by-Row
        while (@rows = $sth->fetchrow_array()) {
               
		if ($rows[1] eq $Cat1Str) {

			$DataJsonStr .= "{ \"serviceType\": \"$rows[0]\",";
                	$DataJsonStr .= "\"badCircuits\": $rows[2],";
                	$DataJsonStr .= "\"goodCircuits\": $rows[3]";
                	$DataJsonStr .= "},";
		}
		elsif ($rows[1] eq $Cat2Str) {

			$VoiceJsonStr .= "{ \"serviceType\": \"$rows[0]\",";
                        $VoiceJsonStr .= "\"badCircuits\": $rows[2],";
                        $VoiceJsonStr .= "\"goodCircuits\": $rows[3]";
                        $VoiceJsonStr .= "},";
		}
		elsif ($rows[1] eq $Cat3Str) {

			$CapacityJsonStr .= "{ \"serviceType\": \"$rows[0]\",";
                        $CapacityJsonStr .= "\"badCircuits\": $rows[2],";
                        $CapacityJsonStr .= "\"goodCircuits\": $rows[3]";
                        $CapacityJsonStr .= "},";
		}
  
		$AllJsonStr .= "{ \"serviceType\": \"$rows[0]\",";
		$AllJsonStr .= "\"badCircuits\": $rows[2],";
		$AllJsonStr .= "\"goodCircuits\": $rows[3]";
		$AllJsonStr .= "},";
        }

	chomp $DataJsonStr;
	chomp $VoiceJsonStr;
	chomp $CapacityJsonStr;
	chomp $AllJsonStr;

	$DataJsonStr .= " ], ";
	$VoiceJsonStr .= " ], ";
	$CapacityJsonStr .= " ], ";
	$AllJsonStr .= " ] ";

        $sth->finish();
        $dbh->disconnect();

	$JsonStr .= $DataJsonStr;
	$JsonStr .= $VoiceJsonStr;
	$JsonStr .= $CapacityJsonStr;
	$JsonStr .= $AllJsonStr;

	$JsonStr .= " } }";

        return($JsonStr);
}


###########################################
##  Function: CreateCustomersJson(...)   ##
###########################################

sub CreateCustomersJson() {

        my($dbh, $ORA_SQL_CMD) = @_;

        # Instead you could do $dbh->do($sql) or execute
        $sth = $dbh->prepare($ORA_SQL_CMD) or die "Can't prepare statement: $dbh->errstr\n";
        $sth->execute() or die "Can't execute statement: $sth->errstr\n";

        print "\nCreating Customers JSON...\n";
	
	$/ = ',';

        my $JsonStr = "{ \"customers\": { ";

	my $Svc1 = "I-IGNET";
	my $Svc2 = "I/N-INTERNET_CONNECTIVITY";
	my $Svc3 = "I-IP_NODE";
	my $Svc4 = "I-IP_TRANSIT";
	my $Svc5 = "I-PEERING-BB";
	my $Svc6 = "I-HARD_PATCH_TRANSIT";
	my $Svc7 = "I-SUBMARINE_CAPACITY";
	my $Svc8 = "I/N-INTERCONNECT_LINK";
	my $Svc9 = "I2N-L2VPN";
	my $Svc10 = "N-WDIA";
	my $Svc11 = "I-OSS-SS";


	my $Svc1JsonStr .= "\"$Svc1\": [ ";
	my $Svc2JsonStr .= "\"$Svc2\": [ ";
	my $Svc3JsonStr .= "\"$Svc3\": [ ";
	my $Svc4JsonStr .= "\"$Svc4\": [ ";
	my $Svc5JsonStr .= "\"$Svc5\": [ ";
	my $Svc6JsonStr .= "\"$Svc6\": [ ";
	my $Svc7JsonStr .= "\"$Svc7\": [ ";
	my $Svc8JsonStr .= "\"$Svc8\": [ ";
	my $Svc9JsonStr .= "\"$Svc9\": [ ";
	my $Svc10JsonStr .= "\"$Svc10\": [ ";
	my $Svc11JsonStr .= "\"$Svc11\": [ ";


        # Convert Array to JSON String Row-by-Row
        while (@rows = $sth->fetchrow_array()) {

                if ($rows[1] eq $Svc1) {

                        $Svc1JsonStr .= "{ \"customerName\": \"$rows[0]\",";
                        $Svc1JsonStr .= "\"serviceType\": \"$rows[1]\", ";
			$Svc1JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc1JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc1JsonStr .= "},";
                }
                elsif ($rows[1] eq $Svc2) {

			$Svc2JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc2JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc2JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc2JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc2JsonStr .= "},";
                }
                elsif ($rows[1] eq $Svc3) {

			$Svc3JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc3JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc3JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc3JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc3JsonStr .= "},";
                }
		elsif ($rows[1] eq $Svc4) {

                        $Svc4JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc4JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc4JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc4JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc4JsonStr .= "},";
                }
                elsif ($rows[1] eq $Svc5) {

                        $Svc5JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc5JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc5JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc5JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc5JsonStr .= "},";
                }
		elsif ($rows[1] eq $Svc6) {

                        $Svc6JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc6JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc6JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc6JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc6JsonStr .= "},";
                }
                elsif ($rows[1] eq $Svc7) {

                        $Svc7JsonStr .= "{ \"customerName\": \"$rows[0]\",";
                        $Svc7JsonStr .= "\"serviceType\": \"$rows[1]\", ";
			$Svc7JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc7JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc7JsonStr .= "},";
                }
		elsif ($rows[1] eq $Svc8) {

                        $Svc8JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc8JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc8JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc8JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc8JsonStr .= "},";
                }
                elsif ($rows[1] eq $Svc9) {

                        $Svc9JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc9JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc9JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc9JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc9JsonStr .= "},";
                }
		elsif ($rows[1] eq $Svc10) {

                        $Svc10JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc10JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc10JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc10JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc10JsonStr .= "},";
                }
                elsif ($rows[1] eq $Svc11) {

                        $Svc11JsonStr .= "{ \"customerName\": \"$rows[0]\",";
			$Svc11JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                        $Svc11JsonStr .= "\"badCircuits\": $rows[3],";
                        $Svc11JsonStr .= "\"goodCircuits\": $rows[4]";
                        $Svc11JsonStr .= "},";
                }
        }

	$sth->finish();
        $dbh->disconnect();

        chomp $Svc1JsonStr;
        chomp $Svc2JsonStr;
        chomp $Svc3JsonStr;
        chomp $Svc4JsonStr;
	chomp $Svc5JsonStr;
        chomp $Svc6JsonStr;
        chomp $Svc7JsonStr;
        chomp $Svc8JsonStr;
	chomp $Svc9JsonStr;
        chomp $Svc10JsonStr;
        chomp $Svc11JsonStr;

        $Svc1JsonStr .= " ], ";
        $Svc2JsonStr .= " ], ";
        $Svc3JsonStr .= " ], ";
        $Svc4JsonStr .= " ], ";
        $Svc5JsonStr .= " ], ";
        $Svc6JsonStr .= " ], ";
	$Svc7JsonStr .= " ], ";
        $Svc8JsonStr .= " ], ";
        $Svc9JsonStr .= " ], ";
        $Svc10JsonStr .= " ], ";
	$Svc11JsonStr .= " ] ";

        $JsonStr .= $Svc1JsonStr;
        $JsonStr .= $Svc2JsonStr;
        $JsonStr .= $Svc3JsonStr;
        $JsonStr .= $Svc4JsonStr;
	$JsonStr .= $Svc5JsonStr;
        $JsonStr .= $Svc6JsonStr;
        $JsonStr .= $Svc7JsonStr;
        $JsonStr .= $Svc8JsonStr;
	$JsonStr .= $Svc9JsonStr;
        $JsonStr .= $Svc10JsonStr;
        $JsonStr .= $Svc11JsonStr;

        $JsonStr .= " } }";

        return($JsonStr);		
}

##########################################
##  Function: CreateCircuitsJson(...)   ##
##########################################

sub CreateCircuitsJson() {

        my($dbh, $ORA_SQL_CMD) = @_;

        # Instead you could do $dbh->do($sql) or execute
        $sth = $dbh->prepare($ORA_SQL_CMD) or die "Can't prepare statement: $dbh->errstr\n";
        $sth->execute() or die "Can't execute statement: $sth->errstr\n";

        print "\nCreating Circuits JSON...\n";

        $/ = ',';

        my $JsonStr = "{ \"circuits\": { ";

	my $PreviousCustomer = "";
	my $CurrentCustomer = "";

        # Convert Array to JSON String Row-by-Row
        while (@rows = $sth->fetchrow_array()) {

		$CurrentCustomer = $rows[0];

		if ($PreviousCustomer ne "") {
			if ($CurrentCustomer ne $PreviousCustomer) {
				chomp $JsonStr;
				$JsonStr .= "], \"$CurrentCustomer\": [ "
			}
		}
		else {

			$JsonStr .= "\"$CurrentCustomer\": [ ";
		}

                $JsonStr .= "{ \"circuitId\": \"$rows[3]\", ";
		$JsonStr .= "\"serviceCategory\": \"$rows[2]\", ";
		$JsonStr .= "\"serviceType\": \"$rows[1]\", ";
                $JsonStr .= "\"alarmsCritical\": $rows[5], ";
                $JsonStr .= "\"alarmsMajor\": $rows[6], ";
		$JsonStr .= "\"alarmsMinor\": $rows[7], ";
		$JsonStr .= "\"alarmsWarning\": $rows[8], ";
		$JsonStr .= "\"alarmsClear\": $rows[9], ";
		$JsonStr .= "\"alarmsIndeterminate\": $rows[10] ";
                $JsonStr .= "},";

		$PreviousCustomer = $CurrentCustomer;
        }

        $sth->finish();
        $dbh->disconnect();

        chomp $JsonStr;

        $JsonStr .= " ] } }";

        return($JsonStr);
}


###############################################
##  Function: CreateCircuitMetricsJson(...)  ##
###############################################

sub CreateCircuitMetricsJson() {

        my($dbh, $ORA_SQL_CMD) = @_;

        # Instead you could do $dbh->do($sql) or execute
        $sth = $dbh->prepare($ORA_SQL_CMD) or die "Can't prepare statement: $dbh->errstr\n";
        $sth->execute() or die "Can't execute statement: $sth->errstr\n";

        print "\nCreating Circuit Metrics JSON...\n";

        $/ = ',';

        my $JsonStr = "{ \"metrics\": { ";

        # Convert Array to JSON String Row-by-Row
        while (@rows = $sth->fetchrow_array()) {

		$JsonStr .= "\"$rows[1]\": {";

                $JsonStr .= "\"availability\": $rows[5], ";
		if ($rows[7] eq "") {
			$JsonStr .= "\"capacity\": null, ";
		}
		else {
			$JsonStr .= "\"capacity\": $rows[7], ";
		}
                #$JsonStr .= "\"capacity\": $rows[7], ";
                $JsonStr .= "\"totalPacketDrop\": $rows[6], ";
		$JsonStr .= "\"totalErrorIn\": $rows[10], ";
		$JsonStr .= "\"totalBpsAvail\": $rows[13] ";
                $JsonStr .= "},";
        }

        $sth->finish();
        $dbh->disconnect();

        chomp $JsonStr;

        $JsonStr .= " } }";

        return($JsonStr);
}


###############################################
##  Function: CreateCustomerAlarmsJson(...)  ##
###############################################

sub CreateCustomerAlarmsJson() {

        my($dbh, $ORA_SQL_CMD) = @_;

        # Instead you could do $dbh->do($sql) or execute
        $sth = $dbh->prepare($ORA_SQL_CMD) or die "Can't prepare statement: $dbh->errstr\n";
        $sth->execute() or die "Can't execute statement: $sth->errstr\n";

        print "\nCreating Customer Alarms JSON...\n";

        $/ = ',';

        my $JsonStr = "{ \"customers\": [ ";

        # Convert Array to JSON String Row-by-Row
        while (@rows = $sth->fetchrow_array()) {

                $JsonStr .= "{";

                $JsonStr .= "\"customerName\": \"$rows[0]\", ";
                $JsonStr .= "\"badCircuits\": $rows[1], ";
                $JsonStr .= "\"goodCircuits\": $rows[2] ";
                $JsonStr .= "},";
        }

        $sth->finish();
        $dbh->disconnect();

        chomp $JsonStr;

        $JsonStr .= " ] }";

        return($JsonStr);
}

1;
