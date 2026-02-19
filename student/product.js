var toggle = document.getElementById('menu-toggle');
var sideBar = document.getElementById('side-bar');
sideBar.style.left = '-250px'; 

toggle.addEventListener('click', toggleMenu);

function toggleMenu() {
    var position = sideBar.style.left;
    if(position === '0px') {
        sideBar.style.left = '-250px';
    } else {
        sideBar.style.left = '0px';
    }
}