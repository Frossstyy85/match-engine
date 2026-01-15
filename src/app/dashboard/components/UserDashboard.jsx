"use client";
import { useState, useEffect } from "react";

export default function UserDashboard() {

    // ===== DATA =====
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [availability, setAvailability] = useState("");

    // ===== INPUTS =====
    const [skillName, setSkillName] = useState("");
    const [skillLevel, setSkillLevel] = useState("Basic");

    const [certificateName, setCertificateName] = useState("");

    const [languageName, setLanguageName] = useState("");
    const [languageLevel, setLanguageLevel] = useState("Basic");

    // ===== DROPDOWN OPTIONS =====
    const skillOptions = ["React", "JavaScript", "Python", "SQL"];
    const certificateOptions = ["AWS Certified", "Cisco CCNA", "Microsoft Azure"];
    const languageOptions = ["Svenska", "Engelska", "Spanska"];
    const levelOptions = ["Basic", "Intermediate", "Advanced"];
    const availabilityOptions = ["Heltid", "Deltid", "Ej tillgänglig"];

    // ===== STATE FÖR ÖPPNA SEKTIONER =====
    const [openSections, setOpenSections] = useState({
        skills: true,
        certs: true,
        languages: true,
        availability: true,
    });

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // ===== LOAD FROM localStorage =====
    useEffect(() => {
        setSkills(JSON.parse(localStorage.getItem("skills") || "[]"));
        setCertificates(JSON.parse(localStorage.getItem("certificates") || "[]"));
        setLanguages(JSON.parse(localStorage.getItem("languages") || "[]"));
        setAvailability(localStorage.getItem("availability") || "");
    }, []);

    // ===== SAVE TO localStorage =====
    useEffect(() => { localStorage.setItem("skills", JSON.stringify(skills)); }, [skills]);
    useEffect(() => { localStorage.setItem("certificates", JSON.stringify(certificates)); }, [certificates]);
    useEffect(() => { localStorage.setItem("languages", JSON.stringify(languages)); }, [languages]);
    useEffect(() => { localStorage.setItem("availability", availability); }, [availability]);

    // ===== SAVE ALL BUTTON =====
    const saveAllChanges = () => {
        const profile = { skills, certificates, languages, availability };
        console.log("Sparar profil:", profile);
        alert("Profil sparad! (kolla console.log för data)");
    };

    // ===== Helpers =====
    const removeItem = (list, setList, index) => {
        const copy = [...list];
        copy.splice(index, 1);
        setList(copy);
    };

    const renderSavedItems = (list, type, setList) => {
        if (list.length === 0) return <p>— Inga sparade {type} —</p>;
        return list.map((item, i) => {
            let text = typeof item === "string" ? item : `${item.name} – ${item.level}`;
            return (
                <li key={i} style={savedItemStyle}>
                    <span>{text}</span>
                    <button style={removeButtonStyle} onClick={() => removeItem(list, setList, i)}>🗑</button>
                </li>
            );
        });
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
            <h2 style={{ marginBottom: "20px" }}>Min profil</h2>

            {/* ================= SKILLS ================= */}
            <Section title="Kunskaper & Kompetenser" open={openSections.skills} toggle={() => toggleSection("skills")}>
                <div style={inputContainerStyle}>
                    <select value={skillName} onChange={(e) => setSkillName(e.target.value)} style={dropdownStyle}>
                        <option value="">Välj kompetens</option>
                        {skillOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} style={dropdownStyle}>
                        {levelOptions.map((l) => <option key={l}>{l}</option>)}
                    </select>

                    <button style={buttonStyle} onClick={() => {
                        if (!skillName) return;
                        setSkills([...skills, { name: skillName, level: skillLevel }]);
                        setSkillName(""); setSkillLevel("Basic");
                    }}>Lägg till</button>
                </div>

                <p><strong>Sparade kompetenser:</strong></p>
                <ul style={listStyle}>{renderSavedItems(skills, "kompetenser", setSkills)}</ul>
            </Section>

            {/* ================= CERTIFICATES ================= */}
            <Section title="Certifikat" open={openSections.certs} toggle={() => toggleSection("certs")}>
                <div style={inputContainerStyle}>
                    <select value={certificateName} onChange={(e) => setCertificateName(e.target.value)} style={dropdownStyle}>
                        <option value="">Välj certifikat</option>
                        {certificateOptions.map((c) => <option key={c}>{c}</option>)}
                    </select>

                    <button style={buttonStyle} onClick={() => {
                        if (!certificateName) return;
                        setCertificates([...certificates, certificateName]);
                        setCertificateName("");
                    }}>Lägg till</button>
                </div>

                <p><strong>Sparade certifikat:</strong></p>
                <ul style={listStyle}>{renderSavedItems(certificates, "certifikat", setCertificates)}</ul>
            </Section>

            {/* ================= LANGUAGES ================= */}
            <Section title="Språk" open={openSections.languages} toggle={() => toggleSection("languages")}>
                <div style={inputContainerStyle}>
                    <select value={languageName} onChange={(e) => setLanguageName(e.target.value)} style={dropdownStyle}>
                        <option value="">Välj språk</option>
                        {languageOptions.map((l) => <option key={l}>{l}</option>)}
                    </select>

                    <select value={languageLevel} onChange={(e) => setLanguageLevel(e.target.value)} style={dropdownStyle}>
                        {levelOptions.map((l) => <option key={l}>{l}</option>)}
                    </select>

                    <button style={buttonStyle} onClick={() => {
                        if (!languageName) return;
                        setLanguages([...languages, { name: languageName, level: languageLevel }]);
                        setLanguageName(""); setLanguageLevel("Basic");
                    }}>Lägg till</button>
                </div>

                <p><strong>Sparade språk:</strong></p>
                <ul style={listStyle}>{renderSavedItems(languages, "språk", setLanguages)}</ul>
            </Section>

            {/* ================= AVAILABILITY ================= */}
            <Section title="Tillgänglighet" open={openSections.availability} toggle={() => toggleSection("availability")}>
                <div style={{ marginBottom: "10px" }}>
                    <select value={availability} onChange={(e) => setAvailability(e.target.value)} style={dropdownStyle}>
                        <option value="">Välj</option>
                        {availabilityOptions.map((a) => <option key={a}>{a}</option>)}
                    </select>
                </div>
                <p><strong>Sparat:</strong> {availability || "—"}</p>
            </Section>

            {/* ================= SPARA ALLA ================= */}
            <div style={{ marginTop: "20px" }}>
                <button style={{ ...buttonStyle, width: "200px" }} onClick={saveAllChanges}>
                    Spara alla ändringar
                </button>
            </div>
        </div>
    );
}

/* ================= COMPONENTS ================= */
function Section({ title, open, toggle, children }) {
    return (
        <section style={{ marginBottom: "20px", border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={toggle}>
                <h3>{title}</h3>
                <span style={{ fontSize: "18px" }}>{open ? "▲" : "▼"}</span>
            </div>
            {open && <div style={{ marginTop: "10px" }}>{children}</div>}
        </section>
    );
}

/* ================= STYLES ================= */
const buttonStyle = {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s",
};
const dropdownStyle = {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "150px",
};
const inputContainerStyle = { display: "flex", gap: "10px", marginBottom: "10px" };
const listStyle = { listStyle: "none", padding: 0, margin: 0 };
const savedItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: "6px 10px",
    borderRadius: "6px",
    marginBottom: "6px",
    transition: "background 0.3s",
};
const removeButtonStyle = {
    background: "transparent",
    border: "none",
    color: "#EF4444",
    cursor: "pointer",
    fontSize: "16px",
};
