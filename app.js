// Initialize Supabase
const SUPABASE_URL = "https://lntrfndfszbbhycarfjt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudHJmbmRmc3piYmh5Y2FyZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MjQ1MDMsImV4cCI6MjA3MjEwMDUwM30.qrr-rlmqvBgoa76u5rXl8vMqpJozQkqpGyzXSwNfMzo";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth Elements
let authSect = document.getElementById("authSect")
let chatSect = document.getElementById("chatSect")

let emailInp = document.getElementById("emailInp")
let passInp = document.getElementById("passInp")

let signUpBtn = document.getElementById("signUpBtn")
let logInBtn = document.getElementById("logInBtn")
let signOutBtn = document.getElementById("signOutBtn")
let forgtPasswBtn = document.getElementById("forgtPasswBtn")

let updtPasswSect = document.getElementById("updtPasswSect")
let newPassInp = document.getElementById("newPassInp")
let updtNewPassBtn = document.getElementById("updtNewPassBtn")

signUpBtn.addEventListener("click" , async () => {

    const { error } = await supabase.auth.signUp({
        email: emailInp.value,
        password: passInp.value,
    })
    if (error) {
        alert(error.message)
        return
    }

    alert("Please check your email to verify.");
    emailInp.value = ""
    passInp.value = ""

})

logInBtn.addEventListener("click" , async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInp.value,
        password: passInp.value,
    })
    if (error) {
        alert(error.message)
        return
    }
    
    authSect.classList.add("hidden")
    chatSect.classList.remove("hidden")
    
    emailInp.value = ""
    passInp.value = ""

    alert("Logged In!");

})

signOutBtn.addEventListener("click" , async () => {

    await supabase.auth.signOut()
    authSect.classList.remove("hidden")
    chatSect.classList.add("hidden")

})

// ---------- Forget Password Request ----------
forgtPasswBtn.addEventListener("click" , async () => {

    const { error } = await supabase.auth.resetPasswordForEmail(emailInp.value , 
        {
            redirectTo: window.location.href
        }
    )

    if (error) {
        alert("Please enter a valid email / " + error.message)
    }
    else {
        alert("Reset link sent to your email!");
    }

})

// ---------- Update Password ----------
updtNewPassBtn.addEventListener("click" , async () => {

    const { data , error } = await supabase.auth.updateUser({
        password: newPassInp.value
    });

    if (error) {
        alert("Something went wrong : " + error.message)
    }
    else {
        alert("Password updated successfully!")

        // First sign out user
        await supabase.auth.signOut();

        // Hide update password section
        updtPasswSect.classList.add("hidden");
        updtPasswSect.style.display = "none";

        // Show only login page
        authPage.classList.remove("hidden");
        authPage.style.display = "block";

        newPage.classList.add("hidden");

        newPassInp.value = "";
    }

});

// ----------<<< Check User Session on Page Load >>>----------

// ----------<<< Auth State Change Listener >>>----------
supabase.auth.onAuthStateChange( async (event, session) => {

    console.log("Auth Change:", event, session);

    // If user came from reset link, show update password section
    if (event === "PASSWORD_RECOVERY") {
        authSect.style.display = "none";
        chatSect.style.display = "none";
        updtPasswSect.style.display = "block";
    }

    if (session) {
        authSect.classList.add("hidden");
        chatSect.classList.remove("hidden");
        updtPasswSect.classList.add("hidden");
    }
    else {
        authSect.classList.remove("hidden");
        chatSect.classList.add("hidden");
        updtPasswSect.classList.add("hidden");
    }
    
});



