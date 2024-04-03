document.addEventListener("DOMContentLoaded", function () {
    const originalDashboardContent = document.querySelector('.dashboard-content').innerHTML;
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
        const dashboardContent = document.querySelector('.dashboard-content');
        dashboardContent.innerHTML = `
        <form action="/store" method="post" enctype="multipart/form-data">
        <input type="file" name="filename">
        <button type="submit" class="btn btn-primary btn-block">submit</button>
        </form>`
    })
    document.querySelector('#dashboard-nav').addEventListener('click', function () {
        const dashboardContent = document.querySelector('.dashboard-content');
        dashboardContent.innerHTML = originalDashboardContent;


    })

});
