var virtualmap = function () {
    let view;

    this.Show = function () {
        let boothcount = 5;
        let width = 400;
        let height = 200;
        let booth;
        let space = 10;

        for (let i = 0; i < boothcount; i++) {
            booth = new xplore.Booth({
                x: 50,
                y: 50 + i * (height + space),
                width: width,
                height: height
            });

            booth.Show();
        }
    };
};