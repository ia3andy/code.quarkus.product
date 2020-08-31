package io.quarkus.code

import io.quarkus.code.service.QuarkusProjectServiceTestUtils
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

@QuarkusTest
class CodeQuarkusTest {

    @ParameterizedTest
    @ValueSource(strings = ["java", "kotlin", "scala"])
    @DisplayName("Should generate a maven project and run it in different language")
    fun testMaven(language: String) {
        val languageExt = if(language != "java") "io.quarkus:quarkus-$language" else ""
        val appName = "test-app-maven-$language"
        val result = given()
                .`when`().get("/api/download?a=$appName&e=$languageExt")
                .then()
                .log().ifValidationFails()
                .statusCode(200)
                .contentType("application/zip")
                .header("Content-Disposition", "attachment; filename=\"$appName.zip\"")
                .extract().asByteArray()
        assertThat(result, notNullValue())
        val dir = QuarkusProjectServiceTestUtils.extractProject(result).first
        val run = WrapperRunner.run(dir.toPath().resolve(appName), WrapperRunner.Wrapper.MAVEN)
        assertThat(run, `is`(0))
    }

    @ParameterizedTest
    @ValueSource(strings = ["java", "kotlin", "scala"])
    @DisplayName("Should generate a gradle project and run it in different language")
    fun testGradle(language: String) {
        val languageExt = if(language != "java") "io.quarkus:quarkus-$language" else ""
        val appName = "test-app-maven-$language"
        val result = given()
                .`when`().get("/api/download?b=GRADLE&a=$appName&v=1.0.0&s=pDS.L0j&e=$languageExt")
                .then()
                .log().ifValidationFails()
                .statusCode(200)
                .contentType("application/zip")
                .header("Content-Disposition", "attachment; filename=\"$appName.zip\"")
                .extract().asByteArray()
        assertThat(result, notNullValue())
        val dir = QuarkusProjectServiceTestUtils.extractProject(result).first
        val run = WrapperRunner.run(dir.toPath().resolve(appName), WrapperRunner.Wrapper.GRADLE)
        assertThat(run, `is`(0))
    }




}
