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
    addPageContent:function(){
        $("body").append(
            $("<div></div>")
                .addClass("container")
                .append( 
                    createDiv("row")
                        .append("<h2>畢業學分比較圖</h2>")
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
    addCleanPageContent:function(){
        $("body").append(
            $("<div></div>")
                .addClass("container")
                .append( 
                    createDiv("row")
                        .append("<h2>學分分類圖</h2>")
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
    updateCourseInfo:function( appointCourses , tableBodyClassName){
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
                                .text( course.status )
                        )
                )
        }
    },
    updateCleanCourseInfo:function( appointCourses , tableBodyClassName){
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
        view.updateCourseInfo( courses.English.course , "english-table-body");
        view.updateCourseInfo( courses.common.course , "common-table-body");
        view.updateCourseInfo( courses.major.course.FirstYear , "obligatory1-table-body");
        view.updateCourseInfo( courses.major.course.SecondYear , "obligatory1-table-body");
        view.updateCourseInfo( courses.major.course.ThirdYear , "obligatory2-table-body");
        view.updateCourseInfo( courses.major.course.optional , "optional-table-body");
        view.updateCourseInfo( courses.major.course.other , "other-table-body");
    },
    updateCleanPagContente:function(){
        view.updateCleanCourseInfo( courseCounter.classifiedCourses.EnglishCourses , "learned-english-table-body");
        view.updateCleanCourseInfo( courseCounter.classifiedCourses.literatureCourses , "learned-common-table-body");
        view.updateCleanCourseInfo( courseCounter.classifiedCourses.PECourses , "learned-common-table-body");
        view.updateCleanCourseInfo( courseCounter.classifiedCourses.commonCourses , "learned-common-table-body");
        view.updateCleanCourseInfo( courseCounter.classifiedCourses.optionalCourses , "learned-optional-table-body");
        view.updateCleanCourseInfo( courseCounter.classifiedCourses.otherCourses , "learned-other-table-body");

        // divide obligatoryCourses to two parts
        var obligatoryCourses = courseCounter.classifiedCourses.obligatoryCourses;
        var part1Length = Math.floor((obligatoryCourses.length/2));
        var obligatoryCoursesPart1 = obligatoryCourses.slice(0,part1Length);
        var obligatoryCoursesPart2 = obligatoryCourses.slice(part1Length,obligatoryCourses.length);
        view.updateCleanCourseInfo( obligatoryCoursesPart1 , "learned-obligatory1-table-body");
        view.updateCleanCourseInfo( obligatoryCoursesPart2 , "learned-obligatory2-table-body");
    }
}

