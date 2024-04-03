document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.sidebar ul li.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    document.querySelector('.open-btn').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.add('active');
    });

    document.querySelector('.close-btn').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.remove('active');
    });
    document.querySelector('#upload').addEventListener('click', function () {
        var myModal = new bootstrap.Modal(document.getElementsByClassName('exampleModal'));
        myModal.show();
    })

});
