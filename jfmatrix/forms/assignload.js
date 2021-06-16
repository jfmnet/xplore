var assignload = function (response) {
    this.Show = function () {
        let form = new xplore.Form({
            text: "Assign Load",
            height: 300,
            onok: function () {
                if (response)
                    response(load);
            }
        });

        let load = new nodalload();

        form.Add(new xplore.NumericTextbox({
            inline: true,
            text: "Force, X",
            value: load.forcex,
            bind: { name: "forcex", object: load }
        }));

        form.Add(new xplore.NumericTextbox({
            inline: true,
            text: "Force, Y",
            value: load.forcey,
            bind: { name: "forcey", object: load }
        }));

        form.Add(new xplore.NumericTextbox({
            inline: true,
            text: "Moment, X",
            value: load.momentx,
            bind: { name: "momentx", object: load }
        }));

        form.Add(new xplore.NumericTextbox({
            inline: true,
            text: "Moment, Y",
            value: load.momenty,
            bind: { name: "momenty", object: load }
        }));

        form.Show();
    };
};