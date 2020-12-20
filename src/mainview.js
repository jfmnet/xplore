var mainview = function () {
    let self = this;
    let container;
    let aboutcontainer;
    let experiencecontainer;
    let educationcontainer;
    let profile;
    let authentication;
    let user;

    this.Show = function () {
        authentication = new firebaseapp({
            onlogin: function (response) {
                user = response;
                view.tools[0].text = "Jonathan";
                view.tools[0].Refresh();
                authentication.Dispose();
            }
        });

        let view = new xplore.View({
            text: "AIT Internship Program",
            tools: [
                new xplore.Button({
                    icon: "account",
                    onclick: this.Login
                })
            ]
        });

        view.SetMenu(this.ShowMenu());
        container = view.Add(new xplore.ScrollContainer({ class: "main-container" }));
        view.Show();

        this.Profile();
    };

    this.ShowMenu = function () {
        let container = new xplore.ListContainer();
        container.Add(new xplore.List({ icon: "account", text: "Profile", onclick: self.Profile }));

        return container;
    };

    this.Login = function () {
        authentication.Show();
    };

    this.Profile = function () {
        container.Clear();

        let group = container.Add(new xplore.Container({ class: "banner group-container" }));
        aboutcontainer = container.Add(new xplore.Container({ class: "group-container" }));
        experiencecontainer = container.Add(new xplore.Container({ class: "group-container" }));
        educationcontainer = container.Add(new xplore.Container({ class: "group-container" }));

        group = container.Add(new xplore.Container({ class: "group-container" }));
        group.Add(new xplore.Header({ text: "Skills" }));

        group = container.Add(new xplore.Container({ class: "group-container" }));
        group.Add(new xplore.Header({ text: "Accomplishments" }));

        xplore.GetJSON("res/profile.json", function (data) {
            profile = data;
            self.About();
            self.Experience();
            self.Education();
        });
    };

    this.About = function () {
        aboutcontainer.Clear();
        aboutcontainer.Add(new xplore.Header({ text: "About" }));
        aboutcontainer.Add(new xplore.Button({ class: "group-editor", icon: "pencil", onclick: self.EditAbout }));
        aboutcontainer.Add(new xplore({ text: profile.about }));
    };

    this.EditAbout = function () {
        let form = new xplore.Form({
            text: "Edit About",
            onok: function () {
                self.About();
            }
        });

        form.Add(new xplore.TextArea({ text: "About", bind: { name: "about", object: profile } }));
        form.Show();
    };

    this.Experience = function () {
        experiencecontainer.Clear();
        experiencecontainer.Add(new xplore.Header({ text: "Experience" }));
        experiencecontainer.Add(new xplore.Button({ class: "group-editor", icon: "plus", onclick: function () { self.EditExperience(); } }));

        if (profile.experiences) {
            let group;

            for (let experience of profile.experiences) {
                group = experiencecontainer.Add(new xplore.Container({ class: "experience-container" }));
                group.Add(new xplore.Button({ class: "group-editor", icon: "pencil", tag: experience, onclick: function (object) { self.EditExperience(object.tag); } }));

                group.Add(new xplore.Header({ text: experience.title, class: "list-title" }));
                group.Add(new xplore({ text: experience.description }));
                group.Add(new xplore({ text: experience.type }));
                group.Add(new xplore({ text: experience.company }));
                group.Add(new xplore({ text: experience.location }));

                if (experience.startdate)
                    group.Add(new xplore({ text: experience.startdate.month + " " + experience.startdate.year }));

                if (experience.enddate)
                    group.Add(new xplore({ text: experience.enddate.month + " " + experience.enddate.year }));
            }
        }
    };

    this.EditExperience = function (object) {
        let model = {};

        if (object)
            model = object;

        let form = new xplore.Form({
            text: "Edit Experience",
            height: 740,
            onok: function () {
                if (!object) {
                    if (!profile.experiences)
                        profile.experiences = [];

                    profile.experiences.push(model);
                }

                self.Experience();
            }
        });

        let scroll = form.Add(new xplore.ScrollContainer());

        scroll.Add(new xplore.Textbox({ text: "Title", bind: { name: "title", object: model } }));
        scroll.Add(new xplore.TextArea({ text: "Description", bind: { name: "description", object: model } }));
        scroll.Add(new xplore.Combobox({
            text: "Employment Type",
            options: ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Apprenticeship", "Seasonal"],
            bind: { name: "type", object: model }
        }));
        scroll.Add(new xplore.Textbox({ text: "Company", bind: { name: "company", object: model } }));
        scroll.Add(new xplore.Textbox({ text: "Location", bind: { name: "location", object: model } }));
        scroll.Add(new xplore.MonthYear({ text: "Start Date", bind: { name: "startdate", object: model } }));
        scroll.Add(new xplore.Checkbox({
            text: "Show End Date",
            value: model.showenddate,
            onchange: function (object) {
                enddate.SetVisibility(object.value);
            }
        }));

        let enddate = scroll.Add(new xplore.MonthYear({
            text: "End Date",
            bind: { name: "enddate", object: model },
            visible: model.showenddate || false
        }));

        form.Show();
    };

    this.Education = function () {
        educationcontainer.Clear();
        educationcontainer.Add(new xplore.Header({ text: "Education" }));
        educationcontainer.Add(new xplore.Button({ class: "group-editor", icon: "plus", onclick: function () { self.EditEducation(); } }));

        if (profile.education) {
            let group;

            for (let education of profile.education) {
                group = educationcontainer.Add(new xplore.Container({ class: "experience-container" }));
                group.Add(new xplore.Button({ class: "group-editor", icon: "pencil", tag: education, onclick: function (object) { self.EditEducation(object.tag); } }));

                group.Add(new xplore.Header({ text: education.school, class: "list-title" }));
                group.Add(new xplore({ text: education.location }));
                group.Add(new xplore({ text: education.degree }));
                group.Add(new xplore({ text: education.field }));

                if (education.startdate)
                    group.Add(new xplore({ text: education.startdate.month + " " + education.startdate.year }));

                if (education.enddate)
                    group.Add(new xplore({ text: education.enddate.month + " " + education.enddate.year }));
            }
        }
    };

    this.EditEducation = function (object) {
        let model = {};

        if (object)
            model = object;

        let form = new xplore.Form({
            text: "Edit Experience",
            height: 555,
            onok: function () {
                if (!object) {
                    if (!profile.experiences)
                        profile.experiences = [];

                    profile.experiences.push(model);
                }

                self.Experience();
            }
        });

        let scroll = form.Add(new xplore.ScrollContainer());

        scroll.Add(new xplore.Textbox({ text: "School", bind: { name: "school", object: model } }));
        scroll.Add(new xplore.Textbox({ text: "Location", bind: { name: "location", object: model } }));
        scroll.Add(new xplore.Textbox({ text: "Degree", bind: { name: "degree", object: model } }));
        scroll.Add(new xplore.Textbox({ text: "Field", bind: { name: "field", object: model } }));
        scroll.Add(new xplore.MonthYear({ text: "Start Date", bind: { name: "startdate", object: model } }));
        scroll.Add(new xplore.Checkbox({
            text: "Show End Date",
            value: model.showenddate,
            onchange: function (object) {
                enddate.SetVisibility(object.value);
            }
        }));

        let enddate = scroll.Add(new xplore.MonthYear({
            text: "End Date",
            bind: { name: "enddate", object: model },
            visible: model.showenddate
        }));

        form.Show();
    };
};