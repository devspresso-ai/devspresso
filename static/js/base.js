$(document).ready(function() {
    let navBarLink = document.getElementById("login_or_develop_link");
    let footerLoginLink = document.getElementById("footer_login_link");
    let footerLogoutLink = document.getElementById("footer_logout_link");
    if (isAuthenticated) {
        navBarLink.href = developLink;
        navBarLink.innerHTML = "Develop";
        footerLoginLink.style.display = "none";
    } else {
        navBarLink.href = loginLink
        navBarLink.innerHTML = "Log In";
        footerLogoutLink.style.display = "none";
    }
});
