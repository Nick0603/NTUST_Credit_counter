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
        $("body").remove();
    },
    addPageContent:function(){
        $("body").append(
            $("<div></div>")
                .addClass("container")
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
                                .text("尚未確認")
                        )
                )
        }
    },
    updateGraduationCredit:function(){
        view.updateCourseInfo( courses.English.course , "english-table-body");
        view.updateCourseInfo( courses.common103.course , "common-table-body");
        view.updateCourseInfo( courses.ME103.course.FirstYear , "obligatory1-table-body");
        view.updateCourseInfo( courses.ME103.course.SecondYear , "obligatory1-table-body");
        view.updateCourseInfo( courses.ME103.course.ThirdYear , "obligatory2-table-body");
        view.updateCourseInfo( courses.ME103.course.optional , "optional-table-body");
    }
}

