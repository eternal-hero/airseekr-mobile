import { Alert,BackHandler, ToastAndroid, Platform } from "react-native";
import Toast from 'react-native-simple-toast';
import { config } from './configProvider';

//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
	toast(message, position) {
		if (position == 'center') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);

		}
		else if (position == 'top') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
		}
		else if (position == 'bottom') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);

		}

	}

	alert(title, message, callback) {
		if (callback === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[config.language],
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[config.language],
						onPress: () => callback,
					},
				],
				{ cancelable: false },
			);
		}

	}

	confirm(title, message, callbackOk, callbackCancel) {
		if (callbackCancel === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[config.language],
					},
					{
						text: msgTitle.ok[0],
						onPress: () => this.btnPageLoginCall(),
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[config.language],
						onPress: () => callbackCancel,
					},
					{
						text: msgTitle.ok[config.language],
						onPress: () => callbackOk,
					},
				],
				{ cancelable: false },
			);
		}

	}

	later(title, message, callbackOk, callbackCancel, callbackLater) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Ask me later',
					onPress: () => msgTitle.later[config.language],
				},
				{
					text: 'Cancel',
					onPress: () => msgTitle.cancel[config.language],
				},
				{
					text: 'OK',
					onPress: () => msgTitle.ok[config.language],
				},
			],
			{ cancelable: false },
		);
	}

}
export const msgProvider = new messageFunctionsProviders();


//--------------------------- Message Provider End -----------------------



//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
	//----------------- message buttons
	ok = ['ok', 'ok'];
	cancel = ['Cancel', 'Cancel'];
	later = ['Later ', 'Later'];
	yes = ['Yes ', 'Yes'];
	no = ['No', 'No'];
	exit = ['Exit TradeMatrix', 'Exit TradeMatrix'];
	delete = ['Delete', 'Delete'];
	block = ['Block User', 'Block User'];
	delete_confirm = ['Are you sure want to delete', 'Are you sure want to delete'];
	block_confirm = ['Are you sure you want to block this user?', 'Are you sure you want to block this user?'];
	clearchat = ['Are you sure want to Clear Chat', 'Are you sure want to Clear Chat'];
	report_confirm = ['Are you sure want to Submit Report', 'Are you sure want to Submit Report'];
	msgexit = ['Are you sure you want to exit TradeMatrix?', 'Are you sure you want to exit TradeMatrix?'];
	logout = ['Logout', 'Logout'];
	remove = ['Remove', 'Remove'];
	login = ['Login', 'Login'];
	msglogout = ['Are you sure you want to logout?', 'Are you sure you want to logout?'];
	msgremove = ['Your all Premium post will Convert into Non-Premium , Do you want to Remove.', 'Your all Premium post will Convert into Non-Premium , Do you want to Remove.'];
	back = ['Back', 'Back'];
	msgback = ['Do you want to Go Back', 'Do you want to Go Back'];
	deactivate = ['deactivate', 'deactivate'];
	usererr = ['User id does not exist', 'User id does not exist'];

	//--------------- message title 
	information = ['Error', 'Error'];
	information1 = ['Please update app', 'Please update app'];
	
	alert = ['Alert', 'Alert'];
	confirm = ['Information Message', 'Information Message'];
	validation = ['Information Message', 'Information Message'];
	success = ['Information Message', 'Information Message'];
	error = ['Information Message', 'Information Message'];
	response = ['Response', 'Response'];
	server = ['Connection Error', 'Connection Error'];
	internet = ['Connection Error', 'Connection Error'];
	

}

export const msgTitle = new messageTitleProvider();

//--------------------------- Title Provider End -----------------------



//--------------------------- Message Provider Start -----------------------

class messageTextProvider {
	//--------------------- Validation messages ---------------

	//------------------ Login messages ---------------
	emptyMobile = ['Please enter mobile number', 'Please enter mobile number'];
	emptyMobiledigit = ['Mobile number must be at least 8 digits', 'Mobile number must be at least 8 digits'];
	emptyEmail = ['Please enter email', 'Please enter email'];
	emptyUsername = ['Please enter username', 'Please enter username'];
	emptyUsername1 = ['Please remove special character', 'Please remove special character'];
	emptybio = ['Please enter bio', 'Please enter bio'];
	emptyDob = ['Please enter age', 'Please enter age'];
	emptyCountry = ['Please select countr', 'Please select country'];
	emptyGender = ['Please select gender', 'Please select gender'];
	emptyPassword = ['Please enter password', 'Please enter password'];
	emptynewPassword = ['Please enter new password', 'Please enter new password'];
	emptyconfirmPassword = ['Please Enter Confirm Password', 'Please enter confirm password'];
	emptyOldpassword = ['Please enter old password', 'Please enter old password'];
	emptypasswordsize = ['Password should be at least 6 characters', 'Password should be at least 6 characters'];
	matchPassword = ['Password or Confirm Password Doesn'+"'"+'t Match.', 'Password or confirm password doesn'+"'"+'t match.' ];
	newmatchPassword = ['New Password or confirm password doesn'+"'"+'t match', ' New Password or confirm password doesn'+"'"+'t match.' ];
	diffrentPassword = ['New password must be different than old password', 'New password must be different than old password' ];
	mobile_er = ['Please enter valid mobile numbe', 'Please enter valid mobile number'];
	validPhone = ['Please enter valid mobile number', 'Please enter valid mobile number']
	validEail = ['Please Enter Valid Email', 'Please Enter Valid Email']
	validWebsite = ['Please Enter Valid Website', 'Please Enter Valid Website']
	validLoanamount = ['Please enter valid loan amount', 'Please enter valid loan amount']
	validmonthlysal = ['Please enter valid monthly salary', 'Please enter valid monthly salary']
	lengthOtp = ['Please enter otp', 'Please enter otp'];
	validOtp = ['Please enter valid otp number', 'Please enter valid otp number']

	emptyprice = ['Please enter price', 'Please enter price']
	emptydisprice = ['Please enter a discount price', 'Please enter a discount price']
	emptydismonth = ['Please enter no of month', 'Please enter no of month']
	emptycomment= ['Please enter comment', 'Please enter comment']
	priceordiscount= ['Discount price must be less than price per month', 'Discount price must be less than price per month']
	

	//-------------------- Registration messages ---------------
	emptyName = ['Please enter name', 'Please enter name'];
	emptyimage = ['Please Choose Profile Image', 'Please Choose Profile Image'];
	
	

	//-------------------- Registration messages ---------------
	loginFirst = ['Please login first', 'Please login first'];
	loginAgain = ['Please login again', 'Please login again'];
	emptyemail = ['Please enter email', 'Please enter email'];
	validemail = ['Please enter valid email', 'Please enter valid email'];
	emptyMessage = ['Please enter message', 'Please enter message'];
	networkconnection = ['Unable to connect. Please check that you are connected to the Internet and try again.', 'Unable to connect. Please check that you are connected to the Internet and try again.'];
	termcheck = ['Please check sign in', 'Please check sign in'];
	interestcheck = ['Please select at least one interest', 'Please select at least one interest'];
	
}

export const msgText = new messageTextProvider();

//--------------------------- Message Provider End -----------------------

class titleAlert {
	title_maintext = ['Welcome to TradeMatrix!', 'Welcome to TradeMatrix!'];
	title_register = ['Register', 'Register'];
	title_singin = ['Sign In', 'Sign In'];
	title_maintext1 = ['Connect with everyday investors to share and view trades, investment activity, portfolios, strategies, research, opinions, and much more!', 'Connect with everyday investors to share and view trades, investment activity, portfolios, strategies, research, opinions, and much more!'];
	title_logintxt = ["Let's sign you in.", "Let's sign you in."];
	title_forgottxt = ["Forgot Password", "Forgot Password"];
	title_loginwel = ["Welcome back.", "Welcome back."];
	title_forgotwel = ["Enter your email to receive a password reset link", "Enter your email to receive a password reset link"];
	title_loginmissed = ["You've been missed!", "You've been missed!"];
	title_username= ["Username", "username"];
	title_name= ["Name", "name"];
	title_email= ["Email", "email"];
	title_cnfrmpass= ["Confirm Password", "Confirm Password"];
	title_logindontacc = ["Don't have an account?", ""];
	title_loginalrdacc = ["Already have an account?", ""];
	title_loginforgo = ["Forgot", "Forgot"];
	title_loginpass = ["Password", "Password"];
	title_loginques = ["?", ""];
	title_restxt = ["Let’s begin", "Let’s begin"];
	title_restxt1 = ["Welcome onboard!", ""];
	title_chooseinterest = ["Choose your interests", ""];
	title_chooseinterest1 = ["Let us know your interests to help you find better options", ""];
	title_continue = ["Continue", ""];
	title_writesomthing= ["Write something", "Write something"];
	title_submit = ["Submit", "Submit"];
	title_accountsetting = ["Account Settings", "Account Settings"];
	title_changeyourpass = ["Change your password", "Change your password"];
	title_blocked = ["Blocked", "Blocked"];
	title_newpost = ["New Post", "New Post"];
	title_posttype = ["Post Type", "Post Type"];
	title_Tesla = ["Tesla", "Tesla"];
	title_Teslasoldat = ["Sold at", "Sold at"];
	title_howmany = ["How Many", "How Many"];
	title_PostOption = ["Post Accessibility", "Post Accessibility"];
	title_howyoupost = ["Choose who can and can’t see this content", "Choose who can and can’t see this content"];
	title_choosestock = ["Choose the holding you sold", "Choose the holding you sold"];
	title_alreadypending = ["You have already withdraw amount which is in pending state", "You have already withdraw amount which is in pending state"];
}
export const titlealert = new titleAlert();

class Handleback{
	handleBackPress = () => {
        Alert.alert(
            msgTitle.exit[config.language],
            msgTitle.msgexit[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => {},
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => BackHandler.exitApp()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };
}
export const handleback=new Handleback();