function createDiv(claassName){
    return $("<div></div>").addClass( claassName );
}

function createTable(className){
    return "" +
        '<table class="table table-striped">'+
        '   <thead> '+
        '        <tr>'+
        '            <td>科目名稱</td>'+
        '           <td>學分數</td>'+
        '           <td>選修狀況</td>'+
        '        </tr>'+
        '    </thead>'+
        '    <tbody class="' + className + '">'+
        '    </tbody>'+
        '</table>'
}

var view = {
    removePageContent:function(){
        $("body").html("");
    },
    addShortagedCouresPages:function(){
        $("body").append(
            $("<div></div>")
                .addClass("container")
                .append( 
                    createDiv("row")
                        .append("<h2>缺少學分表</h2>")
                )
                .append(
                    createDiv("row")
                        .append( 
                            createDiv("col-md-12 Shortaged" )
                                .append( createTable("Shortaged-table-body" ))
                        )
                )
        )
    },
    addGraduatedCouresPages:function(){
        $("body").append(
            $("<div></div>")
                .addClass("container")
                .append( 
                    createDiv("row")
                        .append("<h2>畢業學分比較表</h2>")
                )
                .append( 
                    createDiv("row")
                        .append("<h3>共同必修學分</h3>")
                )
                .append(
                    createDiv("row")
                        .append( 
                            createDiv("col-md-6 English" )
                                .append( createTable("English-table-body" ))
                        )
                        .append( 
                            createDiv("col-md-6 common" )
                                .append( createTable("common-table-body" ))
                        )
                )
                .append(
                    createDiv("row")
                        .append("<h3>專業必修學分</h3>")
                )
                .append(
                    createDiv("row")
                        .append( 
                            createDiv("col-md-6 obligatory1" )
                                .append( createTable("obligatory1-table-body" ))
                        )
                        .append( 
                            createDiv("col-md-6 obligatory2")
                                .append( createTable("obligatory2-table-body" ))
                        )
                )
    
                .append(
                    createDiv("row")
                        .append( 
                            createDiv("col-md-6 optional" )
                                .append("<h3>專業選修</h3>")
                                .append( createTable("optional-table-body"))
                        )
                        .append( 
                            createDiv("col-md-6 other" )
                                .append("<h3>自由選修學分</h3>")
                                .append( createTable("other-table-body"))
                        )
                )
        )
    },
    addLearnedCouresPages:function(){
        $("body").append(
            $("<div></div>")
                .addClass("container")
                .append( 
                    createDiv("row")
                        .append("<h2>學分分類表</h2>")
                )
                .append(
                    createDiv("row")
                        .append( 
                            createDiv("col-md-6 English" )
                                .append("<h3>英文領域</h3>")
                                .append( createTable("Learned-English-table-body" ))
                        )
                        .append( 
                            createDiv("col-md-6 common" )
                                .append("<h3>文學、通識、體育領域</h3>")
                                .append( createTable("Learned-common-table-body" ))
                        )
                )
                .append(
                    createDiv("row")
                        .append("<h3>專業必修學分</h3>")
                )
                .append(
                    createDiv("row")
                        .append(
                            createDiv("col-md-6 obligatory1" )
                                .append( createTable("Learned-obligatory1-table-body" ))
                        )
                        .append( 
                            createDiv("col-md-6 obligatory2")
                                .append( createTable("Learned-obligatory2-table-body" ))
                        )
                )
    
                .append(
                    createDiv("row")
                        .append( 
                            createDiv("col-md-6 optional" )
                                .append("<h3>專業選修</h3>")
                                .append( createTable("Learned-optional-table-body"))
                        )
                        .append( 
                            createDiv("col-md-6 other" )
                                .append("<h3>自由選修學分</h3>")
                                .append( createTable("Learned-other-table-body"))
                        )
                )
        )
    },
    updateGraduatedCourseInfo:function( appointCourses , tableBodyClassName){
        if(appointCourses == undefined)return;
        for(var i=0 ; i<appointCourses.length ; i++){
            var course = appointCourses[i];
            var newData = 
                $("<tr></tr>")
                    .append(
                        $("<td></td>").text( course.name )
                    )
                    .append(
                        $("<td></td>").text( course.credit)
                    )
                    .append(
                        $("<td></td>")
                            .addClass( course.name )
                            .text( course.status )
                    )
            if(course.status.indexOf("未通過") != -1 || course.status == "尚未修課"){
                $(".Shortaged-table-body").append(newData.clone());
                newData.addClass("danger");
            }
            $("." + tableBodyClassName).append(newData)
            
        }
    },
    updateLearnedCourseInfo:function( appointCourses , tableBodyClassName){
        if(appointCourses == undefined)return;
        for(var i=0 ; i<appointCourses.length ; i++){
            var course = appointCourses[i];
            $("." + tableBodyClassName)
                .append(
                    $("<tr></tr>")
                        .append(
                            $("<td></td>").text( course.name )
                        )
                        .append(
                            $("<td></td>").text( course.credit)
                        )
                        .append(
                            $("<td></td>")
                                .addClass( course.name )
                                .text( course.grade )
                        )
                )
        }
    },
    updateGraduationCredit:function(){
        view.updateGraduatedCourseInfo( courses.English.course , "english-table-body");
        view.updateGraduatedCourseInfo( courses.common.course , "common-table-body");
        view.updateGraduatedCourseInfo( courses.major.course.FirstYear , "obligatory1-table-body");
        view.updateGraduatedCourseInfo( courses.major.course.SecondYear , "obligatory1-table-body");
        view.updateGraduatedCourseInfo( courses.major.course.ThirdYear , "obligatory2-table-body");
        view.updateGraduatedCourseInfo( courses.major.course.FourthYear , "obligatory2-table-body");
        view.updateGraduatedCourseInfo( courses.major.course.optional , "optional-table-body");
        view.updateGraduatedCourseInfo( courses.major.course.other , "other-table-body");
    },
    updateLearnedCoures:function(){
        view.updateLearnedCourseInfo( courseCounter.classifiedCourses.EnglishCourses , "learned-english-table-body");
        view.updateLearnedCourseInfo( courseCounter.classifiedCourses.commonAllCourses , "learned-common-table-body");
        view.updateLearnedCourseInfo( courseCounter.classifiedCourses.optionalCourses , "learned-optional-table-body");
        view.updateLearnedCourseInfo( courseCounter.classifiedCourses.otherCourses , "learned-other-table-body");

        // divide obligatoryCourses to two parts
        var obligatoryCourses = courseCounter.classifiedCourses.obligatoryCourses;
        var part1Length = Math.floor((obligatoryCourses.length/2));
        var obligatoryCoursesPart1 = obligatoryCourses.slice(0,part1Length);
        var obligatoryCoursesPart2 = obligatoryCourses.slice(part1Length,obligatoryCourses.length);
        view.updateLearnedCourseInfo( obligatoryCoursesPart1 , "learned-obligatory1-table-body");
        view.updateLearnedCourseInfo( obligatoryCoursesPart2 , "learned-obligatory2-table-body");
    }
}

